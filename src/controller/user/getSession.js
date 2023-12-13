const User = require('../../db/Schema/UserSchema')


async function getSession(req,res) {
    try {
        if (req.session.user) {
            const userId = req.session.user.id
            const user = await User.findById(userId, {firstName: 1, lastName: 1, email: 1, _id: 1})
            const { firstName, lastName, email, _id } = user
            res.status(200).send({
                session: true,
                user: {
                    firstName,
                    lastName,
                    email,
                    id: _id
                }
            })
        } else {
            res.status(200).send({session: false})
        }
    } catch (error) {
    res.status(500).send(error)
    }
}

module.exports = getSession