const { admin, db } = require("../utils/admin");
const config = require("../utils/config");
const firebase = require("firebase");

firebase.initializeApp(config);

const {
    validateSignupData,
    validateLoginData,
} = require("../utils/validators");

exports.signupUser = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    const { valid, errors } = validateSignupData(newUser);
    if (!valid) {
        return res.status(400).json(errors);
    }

    let token, userId;

    db.doc(`/users/${newUser.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return res
                    .status(400)
                    .json({ handle: "this handle is already taken" });
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                        newUser.email,
                        newUser.password
                    );
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/no-img.png?alt=media`,
                userId,
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch((error) => {
            // functions.logger.log("Hello from info. Here's an object:", someObj);
            console.error(error);
            if (error.code === "auth/email-already-in-use") {
                return res
                    .status(400)
                    .json({ email: "this email is already in use" });
            }
            res.status(500).json({ error: error.code });
        });
};

exports.loginUser = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

    const { valid, errors } = validateLoginData(user);
    if (!valid) {
        return res.status(400).json(errors);
    }

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
            return userCredential.user.getIdToken();
        })
        .then((token) => {
            return res.status(200).json({ token });
        })
        .catch((error) => {
            console.error(error);

            if (error.code === "auth/wrong-password") {
                return res.status(403).json({
                    general: "email does not exist or password is invalid",
                });
            }
            return res.status(500).json({ error: error.code });
        });
};

exports.uploadImage = (req, res) => {
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");

    const busboy = BusBoy({ headers: req.headers });

    let imageFilename;
    let imageToBeUploaded = {};

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        console.log(`filename: ${filename}`);

        allowedMimeTypes = ["image/jpeg", "image/png"];
        if (!(mimetype in allowedMimeTypes)){
            console.error(`mimetype not allowed: ${mimetype}`);
            return res.status(400).json({ error: `invalid mimetype. Allowed values are: '${allowedMimeTypes}'` })
        }

        const imageExtension = path.extname(filename);

        if (imageExtension === ""){
            return res.status(400).json({ error: "filename must have an extension" })
        }

        imageFilename = `${Math.round(
            Math.random() * 1000000000000
        )}${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFilename);
        imageToBeUploaded = {
            filepath,
            mimetype,
        };
        file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on("finish", () => {
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype,
                    },
                },
            })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFilename}?alt=media`;
                return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
            })
            .then(() => {
                return res.json({ message: "Image uploaded successfully" });
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).json({ error: error.code });
            });
    });
    busboy.end(req.rawBody);
};
