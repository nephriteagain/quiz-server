const mongoose = require("mongoose");
const User = require("../../db/Schema/UserSchema");
const AuthPassReset = require("../../db/Schema/AuthorizedResetSchema");

const { hashPassword } = require("../../lib/utils/loginHelper");

const {
    passwordLengthChecker,
    passwordCharChecker,
    specialSymbolChecker,
} = require("../../lib/utils/passwordChecker");

async function confirm(req, res) {
    if (!req.body?._id || !req.body?.email || !req.body?.password) {
        return res.status(400).send({ message: "bad request" });
    }

    const id = req.body._id;
    const email = req.body.email;
    const newPassword = req.body.password;

    const correctLength = passwordLengthChecker(newPassword);
    const correctChar = passwordCharChecker(newPassword);
    const correctSymbol = specialSymbolChecker(newPassword);

    if (!correctLength || !correctChar || !correctSymbol) {
        return res.status(400).send({ message: "invalid password" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "invalid id" });
    }

    try {
        const authPassChange = await AuthPassReset.findById(id);

        if (!authPassChange) {
            return res.status(401).send({ message: "incorrect credentials" });
        }
        if (email !== authPassChange.email) {
            return res.status(401).send({ message: "email not matched" });
        }

        const emailOfResetPass = authPassChange.email;

        try {
            await User.findOneAndUpdate(
                { email: emailOfResetPass },
                { password: hashPassword(newPassword) },
            )
            await res.status(201).send({ message: "password changed successfully" });
            return
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "password change failed" });
            return
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "outer trycatch error" });
    }
}

module.exports = confirm;
