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
    if (req.body.body.trim() === "") {
        return res.status(400).json({ body: "field must not be empty" });
    }

    const newShoutout = {
        userHandle: req.user.handle,
        body: req.body.body,
        createdAt: new Date().toISOString(),
        imageUrl: req.user.imageUrl,
        likeCount: 0,
        commentCount: 0,
    };

    db.collection("shoutouts")
        .add(newShoutout)
        .then((doc) => {
            res.status(201).json({ shoutoutId: doc.id, ...newShoutout });
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

            return doc.ref.update({
                commentCount: doc.data().commentCount + 1,
            });
        })
        .then(() => {
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

exports.likeShoutout = (req, res) => {
    const likedDocumentRef = db
        .collection(`/likes`)
        .where("shoutoutId", "==", req.params.shoutoutId)
        .where("userHandle", "==", req.user.handle)
        .limit(1);

    const shoutoutRef = db.doc(`/shoutouts/${req.params.shoutoutId}`);

    const newLike = {
        userHandle: req.user.handle,
        shoutoutId: req.params.shoutoutId,
        createdAt: new Date().toISOString(),
    };

    let shoutoutData = {};

    shoutoutRef
        .get()
        .then((doc) => {
            if (!doc.exists) {
                console.error(`not found /shoutouts/${req.params.shoutoutId}`);
                return res.status(404).json({ error: "not found" });
            }

            shoutoutData = {
                shoutoutId: doc.id,
                ...doc.data(),
            };
            return likedDocumentRef.get();
        })
        .then((data) => {
            if (!data.empty) {
                return res.status(400).json({ error: "already liked" });
            }

            return db
                .collection(`/likes`)
                .add(newLike)
                .then(() => {
                    shoutoutData.likeCount++;
                    shoutoutRef.update({ likeCount: shoutoutData.likeCount });
                })
                .then(() => {
                    return res.json(shoutoutData);
                });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: "something went wrong" });
        });
};

exports.unlikeShoutout = (req, res) => {
    const likedDocumentRef = db
        .collection(`/likes`)
        .where("shoutoutId", "==", req.params.shoutoutId)
        .where("userHandle", "==", req.user.handle)
        .limit(1);

    const shoutoutRef = db.doc(`/shoutouts/${req.params.shoutoutId}`);

    const newLike = {
        userHandle: req.user.handle,
        shoutoutId: req.params.shoutoutId,
        createdAt: new Date().toISOString(),
    };

    let shoutoutData = {};

    shoutoutRef
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: "not found" });
            }

            shoutoutData = {
                shoutoutId: doc.id,
                ...doc.data(),
            };
            return likedDocumentRef.get();
        })
        .then((data) => {
            if (data.empty) {
                return res.status(400).json({ error: "not liked" });
            }

            return db
                .doc(`/likes/${data.docs[0].id}`)
                .delete()
                .then((doc) => {
                    shoutoutData.likeCount--;
                    shoutoutRef.update({ likeCount: shoutoutData.likeCount });
                })
                .then(() => {
                    return res.json(shoutoutData);
                });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: "something went wrong" });
        });
};

exports.deleteShoutout = (req, res) => {
    console.log("key");
    const shoutoutRef = db.doc(`/shoutouts/${req.params.shoutoutId}`);
    shoutoutRef
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: "not found" });
            }

            if (req.user.handle !== doc.data().userHandle) {
                return res.status(403).json({ error: "unauthorized" });
            }

            return shoutoutRef.delete();
        })
        .then(() => {
            return res.status(200).json({ message: "deleted successfully" });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: error.code });
        });
};

exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach((notificationId) => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, { read: true });
    });
    batch
        .commit()
        .then(() => {
            return res.json({ message: "notifications marked as read" });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: error.code });
        });
};
