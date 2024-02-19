const Password_Reset = require("../../db/Schema/PasswordResetSchema");
const AuthPassReset = require("../../db/Schema/AuthorizedResetSchema");

const loginHelper = require("../../lib/utils/loginHelper");
const verify = require('./verify')


describe('verify', () => {

    const req = {
        body: {},
        cookies: {}
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        clearCookie: jest.fn()
    }
    afterEach(() => {
        jest.clearAllMocks()
    });

    it('has missing data, 400', async () => {
        await verify(req,res) // no both
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({message: 'missing credentials'});

        req.body.code = 'code'
        req.cookies.codeId = undefined;
        await verify(req,res) // no cookie
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({message: 'missing credentials'});

        req.body.code = undefined;
        req.cookies.codeId = 'codeid'
        await verify(req,res) // no body
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({message: 'missing credentials'});
    })

    it('should return 400, no request ticket found in DB ', async () => {
        req.body.code = 'code',
        req.cookies.codeId = 'codeId'
        jest.spyOn(Password_Reset, 'findOne').mockReturnValueOnce(null)
        await verify(req,res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({message: 'incorrect credentials'});
    });

    it('should return 400, code does not match', async () => {
        req.body.code = 'code',
        req.cookies.codeId = 'codeId'
        jest.spyOn(Password_Reset, 'findOne').mockReturnValueOnce({code:'not match'})
        await verify(req,res)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({message: 'code not matched'});
    });

    it('should return 500, db error', async () => {
        req.body.code = 'code',
        req.cookies.codeId = 'codeId'
        jest.spyOn(Password_Reset, 'findOne').mockReturnValueOnce({code:'code'})
        jest.spyOn(loginHelper, 'comparePassword').mockImplementationOnce(() => true)
        jest.spyOn(AuthPassReset, 'create').mockReturnValueOnce({})
        await verify(req,res)
        expect(res.send).toHaveBeenCalledWith({message: 'db error'});
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return 200, db error', async () => {
        req.body.code = 'code',
        req.cookies.codeId = 'codeId'
        jest.spyOn(Password_Reset, 'findOne')
            .mockReturnValueOnce({code:'code'})
        jest.spyOn(loginHelper, 'comparePassword')
            .mockImplementationOnce(() => true)
        jest.spyOn(AuthPassReset, 'create')
            .mockReturnValueOnce({_id: 'id', email: 'email@email.com'})
        jest.spyOn(Password_Reset, 'deleteOne')
            .mockImplementationOnce(() => {})
        await verify(req,res)
        expect(res.clearCookie).toHaveBeenCalledWith('codeId');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({_id: 'id', email: 'email@email.com'});
    });

    
    
})