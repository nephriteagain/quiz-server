const User = require('../../db/Schema/UserSchema')
const loginHelper = require("../../lib/utils/loginHelper");
const signin = require('./signin')

describe('signin', () => { 

    afterEach(() => {
        jest.clearAllMocks()
    });

    const req = {
        body: {},
        session: {}
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    }


    it('should sends 400, missing creds when no password OR email in body', async () => {
        await signin(req,res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({message: "missing credentials"});
    });

    it('should send 400, email does not exist', async () => {
        req.body.password = 'password'
        req.body.email = 'e@e.e'
        jest.spyOn(User, 'findOne').mockReturnValueOnce(null)
        await signin(req,res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({message: "bad request"});
    })

    it('should send 500, db error', async () => {
        req.body.password = 'password'
        req.body.email = 'e@e.e'
        jest.spyOn(User, 'findOne').mockRejectedValueOnce()
        await signin(req,res)
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({message: "something went wrong"});
    })

    it('should send 400, password dont match', async () => {
        req.body.password = 'password'
        req.body.email = 'e@e.e'
        jest.spyOn(User, 'findOne').mockReturnValueOnce({password: 'pass_word'})
        await signin(req,res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({message: "incorrect password"});
    })

    it('should send 200, password matched but the user session ', async () => {
        req.body.password = 'password'
        req.body.email = 'e@e.e'
        const result = {
            firstName: 'j',
            lastName: 'l',
            email: 'e@e.e',
            _id: 'id',
            password: 'password'
        }
        const {password, ...noPass} = result
        jest.spyOn(User, 'findOne').mockReturnValueOnce(result)
        jest.spyOn(loginHelper, 'comparePassword').mockImplementationOnce(() => true)
        await signin(req,res)
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({message: "logged in", userData: {
            id: result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email
        }});
    })

    it('should send 200, password matched and already have user session ', async () => {
        req.body.password = 'password'
        req.body.email = 'e@e.e'
        req.session.user = {id: 'id', email: 'e@e.e'}
        const result = {
            firstName: 'j',
            lastName: 'l',
            email: 'e@e.e',
            _id: 'id',
            password: 'password'
        }
        const {password, ...noPass} = result
        jest.spyOn(User, 'findOne').mockReturnValueOnce(result)
        jest.spyOn(loginHelper, 'comparePassword').mockImplementationOnce(() => true)
        await signin(req,res)
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({message: "already logged in", userData: {
            id: result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email
        }});
    })

})

