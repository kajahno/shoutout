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
