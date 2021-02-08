const { db } = require("../utils/admin");

exports.getAllShoutouts = (req, res) => {
    db.collection("shoutouts")
        .orderBy("createdAt", "desc")
        .get()
        .then((data) => {
            let shoutouts = [];
            data.docs.forEach((d) =>
                shoutouts.push({
                    shoutoutId: d.id,
                    ...d.data(),
                })
            );
            return res.json(shoutouts);
        })
        .catch((error) => console.error(error));
};

exports.createShoutout = (req, res) => {
    const newShoutout = {
        userHandle: req.user.handle,
        body: req.body.body,
        createdAt: new Date().toISOString(),
    };

    db.collection("shoutouts")
        .add(newShoutout)
        .then((doc) => {
            res.status(201).json({ message: `${doc.id} created successfully` });
        })
        .catch((error) => res.status(500).json({ error: "internal error" }));
};

exports.getShoutout = (req, res) => {
    let shoutoutData = {};
    db.doc(`/shoutouts/${req.params.shoutoutId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: "shoutout not found" });
            }
            shoutoutData = doc.data();
            shoutoutData.shoutoutId = doc.id;
            return db
                .collection("comments")
                .where("shoutoutId", "==", req.params.shoutoutId)
                .orderBy("createdAt", "desc")
                .get();
        })
        .then((querySnapshot) => {
            shoutoutData.comments = [];
            querySnapshot.forEach((doc) => {
                shoutoutData.comments.push(doc.data());
            });
            return res.json(shoutoutData);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: error.code });
        });
};

exports.addCommentOnShoutout = (req, res) => {
    if (req.body.body.trim() === "") {
        return res.status(400).json({ body: "field must not be empty" });
    }

    let newComment;

    db.doc(`/shoutouts/${req.params.shoutoutId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res
                    .status(404)
                    .json({ error: "shoutout doesn't exist" });
            }

            newComment = {
                shoutoutId: req.params.shoutoutId,
                userHandle: req.user.handle,
                createdAt: new Date().toISOString(),
                body: req.body.body,
                imageUrl: req.user.imageUrl,
            };

            return db.collection("comments").add(newComment);
        })
        .then((doc) => {
            return res.status(201).json({
                commentId: doc.id,
                ...newComment,
            });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: "something went wrong" });
        });
};
