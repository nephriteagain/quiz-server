const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        default: new Date(),
        required: true,
    },
});

module.exports = mongoose.model("User", UserSchema);
