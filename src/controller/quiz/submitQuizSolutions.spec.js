const Quiz = require('../../db/Schema/QuizSchema');
const {generateObjectId} = require('../../lib/testHelpers/generateObjectId')
const submitQuizSolutions = require('./submitQuizSolutions')


describe('submitSolutions', () => {
    afterEach(() => jest.clearAllMocks())

    const req = {
        params: {},
        body: {
            questions: []
        }
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    }

    it('sends 400, invalid id', async () => {
        req.params.id = 'invalid_id'
        await submitQuizSolutions(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'Invalid ID'})
    })

    it('sends a 500', async () => {
        jest.spyOn(Quiz, 'findOne').mockRejectedValueOnce()
        req.params.id = generateObjectId();
        await submitQuizSolutions(req,res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({message: 'error'})
    })
    it('sends a 200', async () => {
        jest.spyOn(Quiz, 'findOne').mockReturnValueOnce({questions: []});
        req.params.id = generateObjectId();
        await submitQuizSolutions(req,res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalled()
    })
})