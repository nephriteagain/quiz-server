const {generateObjectId} = require('../../lib/testHelpers/generateObjectId')
const getQuizzes = require('./getQuizzes')
const Quiz = require('../../db/Schema/QuizSchema')


describe('getQuizzes', () => {
    afterEach(() => jest.clearAllMocks())
    const req = {
        query: {}
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    }
    const result = Array.from({length:10}, () => (
        {
            _id: generateObjectId(),
            title: 'title',
            createdBy: 'me',
            votes: 0
        }
    ))
    // NOTE: use this
    const queryMock = {
        skip: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(result),
      };
    

    it('sucessfully sends a result', async () => {
        jest.spyOn(Quiz, 'find').mockReturnValueOnce(queryMock)
        await getQuizzes(req,res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalled()
    })

    it('catches a error', async () => {
        req.query.title = 'this knee'
        jest.spyOn(Quiz, 'find').mockImplementationOnce(() => {
            throw new Error()
        })
        await getQuizzes(req,res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({message: 'something went wrong'})
    })
})