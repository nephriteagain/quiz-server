const mongoose = require("mongoose");

const AuthPassReset = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: new Date(),
        index: { expires: "10m" }, // expire documents after 10 minute
    },
});

module.exports = mongoose.model("AuthPassReset", AuthPassReset);
