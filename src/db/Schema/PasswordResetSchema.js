const mongoose = require("mongoose");

const PasswordResetSchema = new mongoose.Schema({
    codeId: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: new Date(),
        index: { expires: "10m" }, // expire documents after 5 minute
    },
});

module.exports = mongoose.model("Password_Reset", PasswordResetSchema);
