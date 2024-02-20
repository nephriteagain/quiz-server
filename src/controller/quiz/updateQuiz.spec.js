const Quiz = require('../../db/Schema/QuizSchema');
const {generateObjectId} = require('../../lib/testHelpers/generateObjectId')
const updateQuiz = require('./updateQuiz')

describe('updateQuiz', () => {
    afterEach(() => jest.clearAllMocks())
    const req = {
        session: {},
        body: {}
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    }

    it('no user session, 400', async () => {
        await updateQuiz(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({message: 'user not logged in'})
    })

    it('user is impersonating, 400', async () => {
        req.body.authorId = 'some_id';
        req.session.user = {}, req.session.user.id = 'another_id'
        await updateQuiz(req,res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith({message: 'unauthorized'})
    })

    it('successfully update quiz, 201', async () => {
        const id = generateObjectId();
        req.body._id = generateObjectId(); 
        req.body.authorId = id;
        req.session.user = {};
        req.session.user.id = id;
        
        const result = { _id: id, title: 'Updated Quiz', createdBy: id, votes: 0 };
        jest.spyOn(Quiz, 'findByIdAndUpdate').mockResolvedValueOnce(result);

        await updateQuiz(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(result);
    });
})