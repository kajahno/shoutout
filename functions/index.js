const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

const app = require('express')();

const dotenv = require('dotenv');
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get("/shoutouts", (req, res) => {
    db
        .collection("shoutouts")
        .orderBy("createdAt", "desc")
        .get()
        .then( data => {
            let shoutouts = [];
            data.docs.forEach( d => shoutouts.push({ 
                shoutoutId: d.id,
                ...d.data() 
            }));
            return res.json(shoutouts);
        })
        .catch( error => console.error(error))
});

app.post("/shoutout", (req, res) => {

    const newShoutout = {
        userHandle: req.body.userHandle,
        body: req.body.body,
        createdAt: new Date().toISOString()
    };

    db
    .collection("shoutouts")
    .add(newShoutout)
    .then( doc => {
        res.status(201).json({ message: `${doc.id} created successfully`})
    })
    .catch( error => res.status(500).json({ error: "internal error" }));
});

//Signup route
app.post("/signup", (req, res) => {

    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    //TODO: validate data
    let token, userId;

    db.doc(`/users/${newUser.handle}`).get()
        .then( doc => {
            if (doc.exists){
                return res.status(400).json({ handle: "this handle is already taken" });
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken()
        })
        .then( idToken => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then( () => {
            return res.status(201).json({ token })
        })
        .catch( error => {
            // functions.logger.log("Hello from info. Here's an object:", someObj);
            console.error( error );
            if (error.code === "auth/email-already-in-use"){
                return res.status(400).json({ email: "this email is already in use" })
            }
            res.status(500).json({ error: error.code });
        });
});

exports.api = functions.region("europe-west2").https.onRequest(app);
