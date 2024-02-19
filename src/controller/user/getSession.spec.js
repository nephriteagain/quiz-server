const User = require("../../db/Schema/UserSchema");
const getSession = require('./getSession')

describe('getSession', () => { 
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    const req = {
        session: {}
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    }

    it('should send session: false', async () => {
        await getSession(req,res)
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({session: false});
    });

    it('should send user data', async () => {
        req.session.user = {} // mock
        const user = {
            firstName: 'a',
            lastName: 'b',
            email: 'c@c.c',
        }
        jest.spyOn(User, 'findById').mockReturnValueOnce(user)
        await getSession(req,res)
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({session:true,user});
    });

    it('should sends 500 ', async () => {
        req.session.user = {}
        jest.spyOn(User, 'findById').mockRejectedValueOnce()
        await getSession(req,res)
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({message: 'something went wrong'});
    });

})