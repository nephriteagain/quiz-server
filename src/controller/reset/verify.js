

const Password_Reset = require('../../db/Schema/PasswordResetSchema')
const AuthPassReset = require('../../db/Schema/AuthorizedResetSchema')


const { comparePassword } = require('../../../lib/utils/loginHelper')





async function verify(req,res) {
    if (!req.body?.code || !req.cookies?.codeId) {
        return res.status(400).send({message: 'missing credentials'})
    }
    
    const { code } = req.body
    const { codeId } = req.cookies
    console.log(codeId, 'code id')
    try {

        const requestTicket = await Password_Reset.findOne({codeId: codeId})

        if (!requestTicket) {
            res.status(400).send({message: 'incorrect credentials'})
        } 
        else {
            const userEmail = requestTicket.email

            const codeMatched = comparePassword(code, requestTicket.code)
            if (codeMatched) {
                try {
                    const newAuthPassReset = new AuthPassReset({
                        email: userEmail
                    })
                    const newPassReset = await AuthPassReset.create(newAuthPassReset)
                    const { _id, email } = newPassReset
                    
                    if (!_id || !email) {
                        return res.status(500).send({message: 'db error'})
                    }

                    await Password_Reset.deleteOne({codeId: codeId})
                        .then(() => {
                            res.clearCookie('codeId')
                            return res.status(200).send({_id, email})
                        })
                        .catch((err) => {
                            return res.status(500).send({message: 'db delete err'})
                        })
                } catch (error) {
                    return res.status(500).send({message: 'db error'})
                }
                
            } else {
                res.status(400).send({message: 'code not matched'})
            }
        }

    } catch (error) {
    return res.status(500).send({message: 'outer trycatch err'})
    }
}

module.exports = verify