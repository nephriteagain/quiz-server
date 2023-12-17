const mongoose = require("mongoose");

const RateLimitSchema = new mongoose.Schema({
    ip: {
        type: String,
        unique: true,
        required: true,
    },
    requestTimes: {
        type: Number,
        required: true,
        default: 1,
    },
    expiresAt: {
        type: Date,
        default: new Date(),
        index: { expires: "1m" }, // expire documents after 1 minute
    },
});

module.exports = mongoose.model("Rate_Limit", RateLimitSchema);
