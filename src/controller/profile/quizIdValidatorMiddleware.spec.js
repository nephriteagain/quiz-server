const {generateObjectId} = require('../../lib/testHelpers/generateObjectId')
const quizIdValidatorMiddleware = require('./quizIdValidatorMiddleware')


describe('quizIdValidatorMiddleware', () => {
    afterEach(() => jest.clearAllMocks())
    const req = {
        params: {}
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    }
    const next = jest.fn()
    it('no id param, 401', async () => {
        await quizIdValidatorMiddleware(req,res,next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith({message: 'unauthorized'})
    })

    it('has id param but invalid, 400', async () => {
        req.params.id = 'invalid_id'
        await quizIdValidatorMiddleware(req,res,next)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'invalid id'})
    })

    it('has and and also valid', async () => {
        req.params.id = generateObjectId();
        await quizIdValidatorMiddleware(req,res,next)
        expect(next).toHaveBeenCalled()
    })
})