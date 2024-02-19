const User = require("../../db/Schema/UserSchema");
const loginHelper = require("../../lib/utils/loginHelper");
const signup = require('./signup')

describe('signup', () => { 

    afterEach(() => {
        jest.clearAllMocks()
    });

    const req = {
        body: {}
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    }



    it('should return 401, password and confirmpass does not match', async () => {{
        req.body.password = 'password'
        req.body.confirmPass = 'Password'
        await signup(req,res)
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({message: 'password does not match'});

    }})

    it('should return 201', async () => {
        const user = {
            firstName: 'j',
            lastName: 'l',
            email: 'e@e.e',
            password: 'Password123',
            confirmPass: 'Password123'
        }

        req.body = user
        jest.spyOn(User, 'create').mockReturnValueOnce({})
        jest.spyOn(loginHelper, 'hashPassword').mockImplementationOnce(p => p)
        await signup(req,res)
        const { confirmPass, ...rest } = user
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(rest);        
    });

    it('should return 500', async () => {
        const user = {
            firstName: 'j',
            lastName: 'l',
            email: 'e@e.e',
            password: 'Password123',
            confirmPass: 'Password123'
        }

        req.body = user
        jest.spyOn(User, 'create').mockRejectedValueOnce()
        await signup(req,res)
        const { confirmPass, ...rest } = user
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({message: 'something went wrong'});        
    });

 })