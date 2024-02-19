const Password_Reset = require("../../db/Schema/PasswordResetSchema");
const AuthPassReset = require("../../db/Schema/AuthorizedResetSchema");

const loginHelper = require("../../lib/utils/loginHelper");

async function verify(req, res) {
    if (!req.body?.code || !req.cookies?.codeId) {
        return res.status(400).send({ message: "missing credentials" });
    }

    const { code } = req.body;
    const { codeId } = req.cookies;
    try {
        const requestTicket = await Password_Reset.findOne({ codeId: codeId });

        if (!requestTicket) {
            res.status(400).send({ message: "incorrect credentials" });
            return;
        }
        const userEmail = requestTicket.email;
        
        // NOTE: you did not destructure this because jest
        // somehow can't spy it when invoked while destructured
        const codeMatched = loginHelper.comparePassword(code, requestTicket.code);
        if (!codeMatched) {
            res.status(400).send({ message: "code not matched" });
            return
        }
        try {

            const newPassReset = await AuthPassReset.create({email: userEmail});
            const { _id, email } = newPassReset;

            if (!_id || !email) {
                return res.status(500).send({ message: "db error" });
            }

            await Password_Reset.deleteOne({ codeId: codeId })
            res.clearCookie("codeId");
            res.status(200).send({ _id, email })
            return;
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: "db error" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "outer trycatch err" });
    }
}

module.exports = verify;
