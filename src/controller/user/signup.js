const User = require("../../db/Schema/UserSchema");
const loginHelper = require("../../lib/utils/loginHelper");

// TODO: check the db first if the user already has an account
async function signup(req, res) {
    if (req.body.password !== req.body.confirmPass) {
        res.status(401).send({ message: "password does not match" });
        return;
    }

    const { firstName, lastName, email, password } = req.body;        

    try {
        const existingUser = await User.findOne({email})
        if (existingUser) {
            res.status(409).send({message: 'conflict'})
            return
        }

        const user = {
            email,
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
            password: loginHelper.hashPassword(password),
        };



        await User.create(user);
        res.status(201).send(user);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "something went wrong"});
        return
    }
}

module.exports = signup;
