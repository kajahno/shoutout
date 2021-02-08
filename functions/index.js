const functions = require("firebase-functions");
const app = require("express")();
const dotenv = require("dotenv");

dotenv.config();

const { getAllShoutouts, createShoutout } = require("./handlers/shoutouts");
const {
    signupUser,
    loginUser,
    uploadImage,
    addUserDetails,
    getUserDetails,
} = require("./handlers/users");

const FBAuth = require("./utils/FBAuth");

// Shoutout routes
app.get("/shoutouts", FBAuth, getAllShoutouts);
app.post("/shoutout", FBAuth, createShoutout);

// User routes
app.post("/signup", signupUser);
app.post("/login", loginUser);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getUserDetails);

exports.api = functions.region("europe-west2").https.onRequest(app);
