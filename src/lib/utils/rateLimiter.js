const Rate_Limit = require("../../db/Schema/RateLimitSchema");
const mongoose = require('mongoose')


async function rateLimitChecker(req, res, next) {
    let ip = req.cookies?.id;
    if (!ip || !mongoose.isValidObjectId(ip)) {
        const newRateLimit = new Rate_Limit({})
        try {
            const doc = await Rate_Limit.create(newRateLimit)
            ip = doc._id
            res.cookie("id", ip, {
                maxAge: 999_999_999_999,
                httpOnly: true
            })
            next();
            return;
        } catch (error) {
            console.error(error)
            next();
            return;
        }
    }

    // cookie timeout from cookie
    if (req.cookies?.timeOut) {
        res.status(408).send({ message: "cookie, too many request" });
        return;
    }
    try {
        // GET REQUEST GETS 1 POINT, THE REST IS 5
        const rateLimit = await Rate_Limit.findByIdAndUpdate(
            ip,
            { $inc: { requestTimes: req.method === "GET" ? 1 : 5 } },
            { new: true }
        );
        if (!rateLimit) {
            const newRateLimit = new Rate_Limit({});
            try {
                const doc = await Rate_Limit.create(newRateLimit);
                ip = doc._id
                res.cookie("id", ip, {
                    maxAge: 999_999_999_999,
                    httpOnly: true
                })
                next();
                return;    
            } catch (error) {
                console.error(error)
                next()
                return;
            }            
        }
        const maxRequest = 10;
        if (rateLimit.requestTimes > maxRequest) {
            // timeout cookie created
            res.cookie("timeOut", "wait for a minute", {
                maxAge: 60_000,
                httpOnly: true,
            });
            // server side timeout, only triggers once
            res.status(408).send({ message: "db ,too many request" });
            return;
        }
        next();
        return;
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "server error" });
        return;
    }
}

module.exports = { rateLimitChecker };
