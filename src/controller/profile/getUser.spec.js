const { generateObjectId } = require('../../lib/testHelpers/generateObjectId')
const Quiz = require("../../db/Schema/QuizSchema");
const getUserQuiz = require('./getUserQuiz')

describe('getUserQuiz', () => { 
    afterEach(() => jest.clearAllMocks())
    const req = {
        params: {}
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    }
    
    it('get the quiz list for a specific user', async () => {
        const result = []
        jest.spyOn(Quiz, 'find').mockReturnValueOnce([])
        req.params.id = generateObjectId();
        await getUserQuiz(req,res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(result)        
    })

    it('mongo error, 500', async () => {
        jest.spyOn(Quiz, 'find').mockRejectedValueOnce()
        req.params.id = generateObjectId()
        await getUserQuiz(req,res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({message: 'something went wrong'})        
    })

 })