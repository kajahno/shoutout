const functions = require("firebase-functions");
const admin = require('firebase-admin');
const { firestore } = require("firebase-admin");

admin.initializeApp();

const express = require('express');
const app = express();

app.get("/shoutouts", (req, res) => {
    admin
        .firestore()
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
        .catch( error => console.log(error))
});

app.post("/shoutout", (req, res) => {

    const newShoutout = {
        userHandle: req.body.userHandle,
        body: req.body.body,
        createdAt: new Date().toISOString()
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

exports.api = functions.region("europe-west2").https.onRequest(app);
