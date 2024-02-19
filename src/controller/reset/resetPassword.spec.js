require("dotenv").config();

const nodemailer = require("nodemailer");
const User = require("../../db/Schema/UserSchema");
const Password_Reset = require("../../db/Schema/PasswordResetSchema");


const codeGen = require("../../lib/utils/codeGenerator");


const resetPassword = require('./resetPassword')

describe('resetPassword', () => {
    afterEach(() => jest.clearAllMocks())

    

    const req = {
        body: {},
        cookies: {}
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        cookie: jest.fn()
    }

    it('sends 400, no email in body', async () => {
        await resetPassword(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'provide email address'})
    })

    it('sends 400, email does not exist on DB', async () => {
        req.body.email = 'email@gmail.com'
        jest.spyOn(User, 'findOne').mockReturnValueOnce(null)
        await resetPassword(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'incorrect email'})
    })

    it('sends 500, DB error', async () => {
        req.body.email = 'email@gmail.com'
        jest.spyOn(User, 'findOne').mockRejectedValueOnce('err')
        await resetPassword(req,res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({message: 'server error'})
    })

    it('has no cookie id, creates a new one', async () => {
        req.body.email = 'email@gmail.com'
        jest.spyOn(User, 'findOne').mockReturnValueOnce({email: 'email@gmail.com'})
        jest.spyOn(Password_Reset, 'create').mockReturnValueOnce({})
        const transporter = jest.spyOn(nodemailer, 'createTransport').mockImplementationOnce(() => ({
            sendMail: jest.fn()
        }))
        await resetPassword(req,res)
        expect(transporter).toHaveBeenCalled()
        expect(res.cookie).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith({message: 'reset code sent to email'})

    })

    it('has cookie id, updates it', async () => {
        req.body.email = 'email@gmail.com'
        req.cookies.codeId = codeGen.generateRandomString()
        jest.spyOn(User, 'findOne').mockReturnValueOnce({email: 'email@gmail.com'})
        jest.spyOn(Password_Reset, 'findByIdAndUpdate').mockReturnValueOnce({})
        const transporter = jest.spyOn(nodemailer, 'createTransport').mockImplementationOnce(() => ({
            sendMail: jest.fn()
        }))
        await resetPassword(req,res)
        expect(transporter).toHaveBeenCalled()
        expect(res.cookie).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith({message: 'reset code sent to email'})
    })
    
})
