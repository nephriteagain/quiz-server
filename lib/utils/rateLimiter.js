const { generateRandomString } = require("./codeGenerator");
const Rate_Limit = require("../../src/db/Schema/RateLimitSchema");

async function rateLimitChecker(req, res, next) {
    let ip = req.cookies?.id;
    if (!ip) {
        ip = generateRandomString();
        res.cookie("id", ip, {
            maxAge: 999_999_999,
            httpOnly: true,
        });
    }

    // cookie timeout from cookie
    if (req.cookies?.timeOut) {
        res.status(408).send({ message: "too many request" });
        return;
    }
    try {
        // GET REQUEST GETS 1 POINT, THE REST IS 5
        const rateLimit = await Rate_Limit.findOneAndUpdate(
            { ip },
            { $inc: { requestTimes: req.method === "GET" ? 1 : 5 } },
            { new: true }
        );
        if (!rateLimit) {
            const newRateLimit = new Rate_Limit({ ip });
            await Rate_Limit.create(newRateLimit);
            next();
            return;
        }
        const maxRequest = 360;
        if (rateLimit.requestTimes > maxRequest) {
            // timeout cookie created
            res.cookie("timeOut", "wait for a minute", {
                maxAge: 60_000,
                httpOnly: true,
            });
            // server side timeout, only triggers once
            res.status(408).send({ message: "too many request" });
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
