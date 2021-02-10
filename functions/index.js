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
app.get("/shoutouts", FBAuth, getAllShoutouts);
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
    .firestore.document("likes/{id}")
    .onCreate((snapshot) => {
        db.doc(`/shoutouts/${snapshot.data().shoutoutId}`)
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    console.error(
                        `document /shoutouts/${
                            snapshot.data().shoutoutId
                        } doesnt exist`
                    );
                }
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: "like",
                    read: false,
                    shoutoutId: doc.id,
                });
            })
            .then(() => {
                return;
            })
            .catch((error) => {
                console.error(error);
                return;
            });
    });

exports.deleteNotificationOnUnlike = functions
    .region(config.gcpRegion)
    .firestore.document("likes/{id}")
    .onDelete((snapshot) => {
        db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .then(() => {
                return;
            })
            .catch((error) => {
                console.error(error);
                return;
            });
    });

exports.createNotificationOnComment = functions
    .region(config.gcpRegion)
    .firestore.document("comments/{id}")
    .onCreate((snapshot) => {
        db.doc(`/shoutouts/${snapshot.data().shoutoutId}`)
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    console.error(
                        `document /shoutouts/${
                            snapshot.data().shoutoutId
                        } doesnt exist`
                    );
                }
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
            })
            .then(() => {
                return;
            })
            .catch((error) => {
                console.error(error);
                return;
            });
    });
