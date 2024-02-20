const User = require("../../db/Schema/UserSchema");

async function getSession(req, res) {
    console.log({session: req.session})
    if (!req.session.user) {
        res.status(200).send({ session: false });
        return
    }

    try {
        const userId = req.session.user.id;
        const user = await User.findById(userId, {
            firstName: 1,
            lastName: 1,
            email: 1,
            _id: 1,
        });
        const { firstName, lastName, email, _id } = user;
        res.status(200).send({
            session: true,
            user: {
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

module.exports = getSession;
