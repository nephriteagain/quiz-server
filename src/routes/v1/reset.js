const { Router } = require('express')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')

const User = require('../../db/Schema/UserSchema')
const Password_Reset = require('../../db/Schema/PasswordResetSchema')
const AuthPassReset = require('../../db/Schema/AuthorizedResetSchema')

const { 
  hashPassword, 
  comparePassword 
} = require('../../../lib/utils/loginHelper')

const { 
  generateCode, 
  generateRandomString 
} = require('../../../lib/utils/codeGenerator')

const  {
  passwordLengthChecker,
  passwordCharChecker,
  specialSymbolChecker
} = require('../../../lib/utils/passwordChecker')

require('dotenv').config()

const router = Router()

router.post('/', async (req, res) => {
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
          return res.status(500).send({err})
        })
      

    }
    


  } catch (error) {
    res.status(500).send({error})
  }
    


    
})

router.post('/verify', async (req, res) => {
  
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
    } else {
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
  

})


router.post('/confirm', async (req, res) => {
  if (!req.body?._id || !req.body?.email || !req.body?.password) {
    return res.status(400).send({message: 'bad request'})
  }

  const id = req.body._id
  const email = req.body.email
  const newPassword = req.body.password

  const correctLength = passwordLengthChecker(newPassword)
  const correctChar = passwordCharChecker(newPassword)
  const correctSymbol = specialSymbolChecker(newPassword)

  if (!correctLength || !correctChar || !correctSymbol) {
    return res.status(400).send({message: 'invalid password'})
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({message: 'invalid id'})
  }

  try {
    
    const authPassChange = await AuthPassReset.findById(id)

    if (!authPassChange) {
      return res.status(401).send({message: 'incorrect credentials'})
    }
    if (email !== authPassChange.email) {
      return res.status(401).send({message: 'email not matched'})
    }

    const emailOfResetPass = authPassChange.email

    const userReset = await User.findOneAndUpdate(
      {email: emailOfResetPass},
      {password: hashPassword(newPassword)}
      )
        .then(() => {
          return res.status(201).send({message: 'password changed successfully'})
        })
        .catch((err) => {
          res.status(500).send({message: 'password change failed'})
        })
    

  } catch (error) {
    return res.status(500).send({message: 'outer trycatch error'})
  }


})


module.exports = router