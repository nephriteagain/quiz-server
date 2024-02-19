const mongoose = require("mongoose");
const signout = require('./signout');

jest.mock('mongoose');

describe('signout', () => {
    const req = {
        sessionID: 'fakeSessionID',
        session: {
            destroy: jest.fn((callback) => callback())
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        clearCookie: jest.fn()
    };

    const sessionDbMock = {
        findOneAndDelete: jest.fn(() => ({ someData: 'exampleData' }))
    };

    const dbMock = {
        collection: jest.fn(() => sessionDbMock)
    };

    mongoose.connection = dbMock;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should logout successfully', async () => {
        await signout(req, res);

        // Verify that findOneAndDelete is called with the correct arguments
        expect(sessionDbMock.findOneAndDelete).toHaveBeenCalledWith({
            _id: req.sessionID,
        });

        // Verify that destroy, clearCookie, and send are called with the correct arguments
        expect(req.session.destroy).toHaveBeenCalled();
        expect(res.clearCookie).toHaveBeenCalledWith("connect.sid");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ someData: 'exampleData' });
    });

});
