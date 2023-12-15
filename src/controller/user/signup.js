const User = require('../../db/Schema/UserSchema')
const { hashPassword } = require('../../../lib/utils/loginHelper')

// TODO: check the db first if the user already has an account
async function signup(req,res) {
    if (req.body.password !== req.body.confirmPass) {
        res.status(401).send({message: 'password does not match'})
       }
     
    const {firstName, lastName, email, password} = req.body
    
    const user = new User(
        {
            email, 
            firstName: firstName.toLowerCase(), 
            lastName: lastName.toLowerCase(), 
            password: hashPassword(password)
        }
    )
     
    try {
        await User.create(user)
        res.status(201).send(user)  
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
}

module.exports = signup