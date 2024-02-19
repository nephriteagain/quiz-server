const User = require("../../db/Schema/UserSchema");
const AuthPassReset = require("../../db/Schema/AuthorizedResetSchema");

const { generateObjectId} = require('../../lib/testHelpers/generateObjectId')
const pwChecker = require("../../lib/utils/passwordChecker");
const confirm = require('./confirm')

describe('confirm', () => { 
    const req = {
        body: {}
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    }
    afterEach(() => jest.clearAllMocks())

    it('has missing data', async () => {
        // no id
        req.body._id = undefined;
        req.body.email = 'email@email.com'
        req.body.password = 'password'
        await confirm(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'bad request'})
        // no email
        req.body._id = generateObjectId();
        req.body.email = undefined;
        req.body.password = 'password'
        await confirm(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'bad request'})
        // no password
        req.body._id = generateObjectId();
        req.body.email = 'email@email.com'
        req.body.password = undefined
        await confirm(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'bad request'})

    })


    it('has invalid passwords', async () => {
        req.body._id = generateObjectId();
        req.body.email = 'fakeEmail@gmail.com'

        jest.spyOn(pwChecker, 'passwordLengthChecker').mockReturnValueOnce(false)
        const pw = 'short'
        req.body.password = pw
        await confirm(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'invalid password'})


        jest.spyOn(pwChecker, 'passwordLengthChecker').mockReturnValueOnce(false)
        const pw2 = 'NoNumber'
        req.body.password = pw2
        await confirm(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'invalid password'})

        jest.spyOn(pwChecker, 'passwordLengthChecker').mockReturnValueOnce(false)
        const p3 = 'has$ymbol'
        req.body.password = p3
        await confirm(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'invalid password'})
    })

    it('has invalid id type', async () => {
        req.body._id = 'invalid_id';
        req.body.email = 'email@email.com'
        req.body.password = 'Password123'
        await confirm(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'invalid id'})
    })

    it('cannot find the reset id', async () => {
        req.body._id = generateObjectId();
        req.body.email = 'email@email.com'
        req.body.password = 'Password123'
        jest.spyOn(AuthPassReset, 'findById').mockReturnValueOnce(null)
        await confirm(req,res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith({message: 'incorrect credentials'})
    })

    it('sends 401, email does not match', async () => {
        req.body._id = generateObjectId();
        req.body.email = 'email@email.com'
        req.body.password = 'Password123'
        jest.spyOn(AuthPassReset, 'findById').mockReturnValueOnce({email:'anothermail'})
        await confirm(req,res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith({message: 'email not matched'})
    })

    it('sends 201, user password change succeed', async () => {
        req.body._id = generateObjectId();
        req.body.email = 'email@email.com'
        req.body.password = 'Password123'
        jest.spyOn(AuthPassReset, 'findById').mockReturnValueOnce({email:'email@email.com'})
        jest.spyOn(User, 'findOneAndUpdate').mockReturnValueOnce({})
        await confirm(req,res)
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith({message: 'password changed successfully'})
    })

    it('failed to change password, 500', async () => {
        req.body._id = generateObjectId();
        req.body.email = 'email@email.com'
        req.body.password = 'Password123'
        jest.spyOn(AuthPassReset, 'findById').mockReturnValueOnce({email:'email@email.com'})
        jest.spyOn(User, 'findOneAndUpdate').mockRejectedValueOnce('error')
        await confirm(req,res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({message: 'password change failed'})
    })

    it('throws an error 500 due to AuthPassReset', async () => {
        req.body._id = generateObjectId();
        req.body.email = 'email@email.com'
        req.body.password = 'Password123'
        jest.spyOn(AuthPassReset, 'findById').mockRejectedValueOnce('err')
        await confirm(req,res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({message: 'outer trycatch error'})  
    })

 })
