require('dotenv').config()

const nodemailer = require('nodemailer')
const User = require('../../db/Schema/UserSchema')
const Password_Reset = require('../../db/Schema/PasswordResetSchema')

const { hashPassword } = require('../../../lib/utils/loginHelper')

const { 
    generateCode, 
    generateRandomString 
} = require('../../../lib/utils/codeGenerator')



async function resetPassword(req,res) {
    if (!req.body?.email) {
        return res.status(400).send({message: 'provide email address'})
    }
      
    const { email } = req.body  
    
    
    const newCode = generateCode()
    const codeId = generateRandomString()
    
    try {
        const isEmailExist = await User.findOne({email: email})    
        if (!isEmailExist) {
            return res.status(400).send({message: 'incorrect email'})
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({error})
    }
            
    try {    
        let config = {
            service: 'gmail',
            auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
            }
        }
    
        let transporter = nodemailer.createTransport(config)
        
        let message = {
            from: process.env.EMAIL,
            to: email,
            subject: "quiz generator password reset",
            html: `<p>password rest code: ${newCode}</p>`
        }
        
        const hashedPw = hashPassword(newCode)
        const newPassCodeReset = new Password_Reset({
            code: hashedPw, 
            codeId: codeId, 
            email: email
        })      

        if (!req.cookies?.codeId) {
            await transporter.sendMail(message)
            .then(async () => {
                await Password_Reset.create(newPassCodeReset)
            })
            .then(() => {
                res.cookie('codeId', codeId, {maxAge: 300_000, httpOnly: true, })
                res.status(201).send({message: 'reset code sent to email'})
                return
            })
            .catch((err) => {
                console.error(error)
                return res.status(500).send({err})
            })

        } else {
            const cookieCodeId = req.cookies.codeId

            await transporter.sendMail(message)
            .then(async () => {
                await Password_Reset.findByIdAndUpdate(
                {codeId: cookieCodeId}, 
                {code: hashedPw}
                )
            })
            .then((res) => {
                console.log(res)
                return res.status(201).send({message: 'reset code sent to email'})
            })
            .catch((err) => {
                console.error(error)
                return res.status(500).send({err})
            })
            

        }
    


    } catch (error) {
        console.error(error)
        res.status(500).send({error})
    }
}

module.exports = resetPassword