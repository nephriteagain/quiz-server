const { checkCredentials, createQuiz } = require('./createQuiz');
const Quiz = require('../../db/Schema/QuizSchema');
const { generateObjectId } = require('../../lib/testHelpers/generateObjectId')

describe('createQuiz', () => {
    const next = jest.fn()
    describe('checkCredentials', () => {
        const req = {
            body: {},
            session: {}
        }
        const res = {
            status: jest.fn(() => res),
            send: jest.fn()
        }

        it('sends 401, user not login', () => {
            checkCredentials(req,res,next)
            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.send).toHaveBeenCalledWith({message: 'unauthorized'})
        })
        
        it('sends 401, user is impersonating', () => {
            req.session.user = {}, req.session.user.id = 'notsomeid'
            req.body.authorId = 'someid'
            checkCredentials(req, res, next)
            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.send).toHaveBeenCalledWith({message: 'forbidden'})
        })

        it('sucessfully verified user', () => {
            const id = generateObjectId()
            req.session.user = {}, req.session.user.id = id
            req.body.authorId = id;
            checkCredentials(req,res,next)
            expect(next).toHaveBeenCalled()
        })
    })

    describe('createQuiz', () => {
        const req = {
            body: {},
        }
        const res = {
            status: jest.fn(() => res),
            send: jest.fn()
        }
        it('creates a new quiz, sends 201', async () => {
            jest.spyOn(Quiz, 'create').mockReturnValueOnce({})
            await createQuiz(req,res)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.send).toHaveBeenCalledWith(req.body)
        })

        it('catches an error, sends 500', async () => {
            const err = 'error'
            jest.spyOn(Quiz, 'create').mockRejectedValueOnce(err)
            await createQuiz(req,res)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.send).toHaveBeenCalledWith({message: 'something went wrong'})
        })

    })

})