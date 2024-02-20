const mongoose = require('mongoose')
const { 
    createNewRateLimitSession, 
    updateRateLimitSession, 
    timeoutUser 
} = require('./rateLimiter')

async function rateLimitChecker(req, res, next) {
    // user no ratelimit session
    let ip = req.cookies?.id;
    if (!ip || !mongoose.isValidObjectId(ip)) {
        createNewRateLimitSession(res, next)
        return;
    }

    // cookie timeout from cookie
    if (req.cookies?.timeOut) {
        timeoutUser(res)
        return;
    }
    updateRateLimitSession(req,res,next, ip)
    return
}

module.exports = {
    rateLimitChecker
}