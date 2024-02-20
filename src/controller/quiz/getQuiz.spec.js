const getQuiz = require('./getQuiz');
const Quiz = require('../../db/Schema/QuizSchema')
const { generateObjectId } = require('../../lib/testHelpers/generateObjectId')

describe('getQuiz', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })
    const req = {
        params: {}
    };
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
    }

    it('sends 400, is invalid id', async () => {
        req.params.id = 'invalid_id'
        await getQuiz(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'Invalid ID'})
    })

    it('sends 404, no quiz found', async () => {
        req.params.id = generateObjectId();        
        jest.spyOn(Quiz, 'findOne').mockReturnValueOnce(null)
        await getQuiz(req,res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith({message: 'quiz not found'})
    })

    it('sends 200', async () => {
        req.params.id = generateObjectId();        
        jest.spyOn(Quiz, 'findOne').mockReturnValueOnce({
            questions: [], // i need this for the map method
        })
        await getQuiz(req,res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalled()
    })

    it('sends 500', async () => {
        req.params.id = generateObjectId();
        const err = 'error'
        jest.spyOn(Quiz, 'findOne').mockRejectedValueOnce(err)
        await getQuiz(req,res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({message: 'something went wrong'})
    })
})