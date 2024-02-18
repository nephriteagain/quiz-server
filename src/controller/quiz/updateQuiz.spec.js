const Quiz = require('../../db/Schema/QuizSchema');
const {generateObjectId} = require('../../lib/testHelpers/generateObjectId')
const updateQuiz = require('./updateQuiz')

describe('updateQuiz', () => {
    afterEach(() => jest.clearAllMocks())
    const req = {
        session: {}
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    }

    it('no user session, 400', async () => {
        await updateQuiz(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'unauthorized'})
    })
})