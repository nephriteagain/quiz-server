const mongoose = require("mongoose");

async function signout(req, res) {
    const db = mongoose.connection;
    const sessionDb = db.collection("sessions");
    const userSession = await sessionDb.findOneAndDelete({
        _id: req.sessionID,
    });
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.status(500).send(userSession);
        } else {
            res.clearCookie("connect.sid");
            res.status(200).send(userSession);
        }
    });
}

module.exports = signout;
