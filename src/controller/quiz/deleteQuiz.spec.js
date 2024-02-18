const deleteQuiz = require('./deleteQuiz')
const Quiz = require('../../db/Schema/QuizSchema')
const { generateObjectId } = require('../../lib/testHelpers/generateObjectId')

describe('deleteQuiz', () => {
    const req = {
        body: {}
    }
    const res = {
        status: jest.fn(() => res),
        send: jest.fn()
    }
    
    it('emits 400, invalid id', async () => {
        const id = 'invalid_id';
        req.body.id = id;
        await deleteQuiz(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'invalid id'})
    })

    it('emits 200, deletes id', async () => {
        const id = generateObjectId();
        const result = {_id:id};
        jest.spyOn(Quiz, 'findByIdAndDelete').mockReturnValueOnce(result)
        req.body.id = id;
        await deleteQuiz(req,res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(result)
    })

    it('emits 404, quiz not found', async () => {
        const id = generateObjectId();
        jest.spyOn(Quiz, 'findByIdAndDelete').mockReturnValueOnce(null)
        req.body.id = id;
        await deleteQuiz(req,res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith({message: 'quiz not found'})
    })

    it('emits 500, mongo error', async () => {
        const id = generateObjectId();
        const err = 'error'
        jest.spyOn(Quiz, 'findByIdAndDelete').mockRejectedValueOnce(err)
        req.body.id = id;
        await deleteQuiz(req,res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith(err)
    })
})
