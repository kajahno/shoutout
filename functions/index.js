const functions = require("firebase-functions");
const admin = require('firebase-admin');
const { firestore } = require("firebase-admin");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello world!!");
});

exports.getShoutouts = functions.https.onRequest((req, res) => {
    admin
        .firestore()
        .collection("shoutouts")
        .get()
        .then( data => {
            let shoutouts = [];
            data.docs.forEach( d => shoutouts.push(d.data()));
            return res.json(shoutouts);
        })
        .catch( error => console.log(error))
});

exports.createShoutout = functions.https.onRequest((req, res) => {

    if (req.method !== "POST"){
        return res.status(400).json({ error: "method not allowed" });
    }

    const newShoutout = {
        userHandle: req.body.userHandle,
        body: req.body.body,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin
        .firestore()
        .collection("shoutouts")
        .add(newShoutout)
        .then( doc => {
            res.status(201).json({ message: `${doc.id} created successfully`})
        })
        .catch( error => res.status(500).json({ error: "internal error" }));
});
