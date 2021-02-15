const functions = require("firebase-functions");
const app = require("express")();
const dotenv = require("dotenv");

dotenv.config();

const {
    getAllShoutouts,
    createShoutout,
    getShoutout,
    addCommentOnShoutout,
    likeShoutout,
    unlikeShoutout,
    deleteShoutout,
    markNotificationsRead,
} = require("./handlers/shoutouts");
const {
    signupUser,
    loginUser,
    uploadImage,
    addUserDetails,
    getUserDetails,
    getUserPublicDetails,
} = require("./handlers/users");

const FBAuth = require("./utils/FBAuth");
const { db } = require("./utils/admin");
const config = require("./utils/config");

// Shoutout routes
app.get("/shoutouts", getAllShoutouts);
app.post("/shoutout", FBAuth, createShoutout);
app.get("/shoutout/:shoutoutId", getShoutout);
app.delete("/shoutout/:shoutoutId", FBAuth, deleteShoutout);
app.post("/shoutout/:shoutoutId/like", FBAuth, likeShoutout);
app.post("/shoutout/:shoutoutId/unlike", FBAuth, unlikeShoutout);
app.post("/shoutout/:shoutoutId/comment", FBAuth, addCommentOnShoutout);
// TODO: edit comment on a shoutout
// TODO: remove comment on a shoutout

// User routes
app.post("/signup", signupUser);
app.post("/login", loginUser);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getUserDetails);
app.get("/user/:handle", getUserPublicDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

exports.api = functions.region(config.gcpRegion).https.onRequest(app);

exports.createNotificationOnLike = functions
    .region(config.gcpRegion)
    .firestore.document("/likes/{id}")
    .onCreate((snapshot) => {
        return db
            .doc(`/shoutouts/${snapshot.data().shoutoutId}`)
            .get()
            .then((doc) => {
                if (
                    doc.exists &&
                    doc.data().userHandle !== snapshot.data().userHandle
                ) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: "like",
                        read: false,
                        shoutoutId: doc.id,
                    });
                }
                console.error(
                    `document /shoutouts/${
                        snapshot.data().shoutoutId
                    } doesnt exist`
                );
            })
            .catch((error) => {
                console.error(error);
            });
    });

exports.deleteNotificationOnUnlike = functions
    .region(config.gcpRegion)
    .firestore.document("/likes/{id}")
    .onDelete((snapshot) => {
        return db
            .doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch((error) => {
                console.error(error);
            });
    });

exports.createNotificationOnComment = functions
    .region(config.gcpRegion)
    .firestore.document("/comments/{id}")
    .onCreate((snapshot) => {
        return db
            .doc(`/shoutouts/${snapshot.data().shoutoutId}`)
            .get()
            .then((doc) => {
                if (
                    doc.exists &&
                    doc.data().userHandle !== snapshot.data().userHandle
                ) {
                    return db
                        .doc(`/notifications/${snapshot.data().shoutoutId}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().userHandle,
                            sender: snapshot.data().userHandle,
                            type: "comment",
                            read: false,
                            shoutoutId: doc.id,
                        });
                }
                console.error(
                    `document /shoutouts/${
                        snapshot.data().shoutoutId
                    } doesnt exist`
                );
            })
            .catch((error) => {
                console.error(error);
            });
    });

exports.onUserImageChange = functions
    .region(config.gcpRegion)
    .firestore.document("/users/{id}")
    .onUpdate((change) => {
        console.log(change.before.data());
        console.log(change.after.data());
        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            const batch = db.batch();
            return db
                .collection(`shoutouts`)
                .where("userHandle", "==", change.before.data().handle)
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        let docRef = db.doc(`/shoutouts/${doc.id}`);
                        batch.update(docRef, {
                            imageUrl: change.after.data().imageUrl,
                        });
                    });
                    return batch.commit();
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    });

exports.onShoutoutDelete = functions
    .region(config.gcpRegion)
    .firestore.document("/shoutouts/{shoutoutId}")
    .onDelete((snapshot, context) => {
        console.log(`user: ${snapshot.data().userHandle}`);
        console.log(`shoutoutId: ${context.params.shoutoutId}`);
        const shoutoutId = context.params.shoutoutId;
        let batch = db.batch();
        return db
            .collection("comments")
            .where("shoutoutId", "==", shoutoutId)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    docRef = db.doc(`/comments/${doc.id}`);
                    batch.delete(docRef);
                });
                return db
                    .collection("likes")
                    .where("shoutoutId", "==", shoutoutId)
                    .get();
            })
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    docRef = db.doc(`/likes/${doc.id}`);
                    batch.delete(docRef);
                });
                return db
                    .collection("notifications")
                    .where("shoutoutId", "==", shoutoutId)
                    .get();
            })
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    docRef = db.doc(`/notifications/${doc.id}`);
                    batch.delete(docRef);
                });
                return batch.commit();
            })
            .catch((error) => {
                console.error(error);
            });
    });
