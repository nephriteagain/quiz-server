const User = require("../../db/Schema/UserSchema");
const loginHelper = require("../../lib/utils/loginHelper");

async function signin(req, res) {
    if (!req.body.password || !req.body.email) {
        res.status(400).send({ message: "missing credentials" });
        return;
    }

    try {
        const user = await User.findOne({ email: req.body.email });

        // incorrect email
        if (!user) {
            res.status(400).send({ message: "bad request" });
            return;
        }

        const passwordMatched = loginHelper.comparePassword(
            req.body.password,
            user.password,
        );
        if (!passwordMatched) {
            res.status(400).send({ message: "incorrect password" });
            return
        }
        const { _id, firstName, lastName, email } = user;

        if (!req.session.user) {
            req.session.user = {
                id: _id,
                email: email,
            };
            res.status(200).send({
                message: "logged in",
                userData: {
                    firstName,
                    lastName,
                    email,
                    id: _id,
                },
            });
            return
        }
        res.status(200).send({
            message: "already logged in",
            userData: {
                firstName,
                lastName,
                email,
                id: _id,
            },
        });
        return
        
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "something went wrong"});
        return;
    }
}

module.exports = signin;
