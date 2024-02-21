const request = require('supertest')
const app = require('../app')
const mongoDB = require('../lib/testHelpers/mongoDb')
const { sessionStore } = require('../db/index')

const {generateObjectId} = require('../../src/lib/testHelpers/generateObjectId')
const {
    sessionCookie, 
    authorId,
    e2eQuizId,
    e2eUserId
} = require('./helpers')

describe("Quiz route", () => {


    beforeAll(async () => {
        await mongoDB.connect();
    });

    afterAll(async () => {
        await mongoDB.disconnect();
        await sessionStore.close()
    });



    describe('GET /, getQuizzes', () => { 
        it('should get 200', async () => {
            return await request(app)
                .get('/api/v1')
                .expect(200)                
        });

        it('should get 200, with title query params', async () => {
            return await request(app)
                .get('/api/v1?title=jade')
                .expect(200)                
        });

        it('should get 200, with author query params', async () => {
            return await request(app)
                .get('/api/v1?author=jade')
            .expect(200)                
        });
    })

    describe('GET /quiz/:id', () => { 
        it('should return 200, when id param is not a valid ObjectId', async () => {
            return await request(app)
                .get('/api/v1/quiz/invalid_id')
                .expect(400)
        });

        it('should return 404, when quiz not found', async () => {
            return await request(app)
                .get(`/api/v1/quiz/${generateObjectId()}`)
                .expect(404)
        })

        it('should return 200, when quiz is found', async () => {
            const testId = '65d16cfa452dff7be7d7c0fb'
            return await request(app)
                .get(`/api/v1/quiz/${testId}`)
                .expect(200)
        })
     })

    describe('POST /', () => { 
        it('should return 401, no user session', async () => {
            return await request(app)
                .post('/api/v1/')
                .expect(401)
                .expect({message: 'unauthorized'})
        });        

        it('should return 401, body.authorId !== session.user.id', async () => {            
            return await request(app)
                .post('/api/v1/')
                .set('Cookie', `${sessionCookie}`)
                .withCredentials(true)
                .send({authorId: generateObjectId()})
                .expect(401)
                .expect({message: 'forbidden'})
        });

        it('should return 201, creates a new quiz', async () => {
            const quiz = {
                title: 'e2e_test',
                authorId,
                createdBy: 'jade lazo',
                questions: [
                    {
                        questionText: 'who was in paris?',
                        correctAnswer: 'french',
                        options: [
                            'french',
                            'british',
                            'croissant'
                        ]
                    }
                ]
            }
            return await request(app)
                .post('/api/v1/')
                .set('Cookie', `${sessionCookie}`)
                .withCredentials(true)
                .send(quiz)
                .expect(201)
        });
    })

    describe('POST /update/:id', () => { 

        it('should return 400, no user session', async () => {
            return await request(app)
                .post(`/api/v1/update/${e2eQuizId}`)  
                .expect(400)
                .expect({message: 'user not logged in'})
        });

        it('should return 401, authorId !== session.user.id', async () => {
            const body = {
                _id: generateObjectId(),
                authorId: generateObjectId(),                
                title: 'updated title'
            }
            return await request(app)        
                .post(`/api/v1/update/${e2eQuizId}`)
                .set('Cookie', `${sessionCookie}`)
                .withCredentials(true)
                .send(body)
                .expect(401)
                .expect({message: 'unauthorized'})
        });

        it('should return 201, quiz sucessfully updated', async () => {
            const body = {
                _id: e2eQuizId,
                authorId: e2eUserId,                
                title: `updated title `
            }
            return await request(app)        
                .post(`/api/v1/update/${e2eQuizId}`)
                .set('Cookie', `${sessionCookie}`)
                .withCredentials(true)
                .send(body)
                .expect(201)
        });

     })

    describe('POST /quiz/:id', () => { 
        it('should return 400, invalid id', async () => {
            return await request(app)
                .post(`/api/v1/quiz/invalid_id`)
                .expect(400)
                .expect({message: 'Invalid ID'})
        });
        it('should return 200', async () => {
            const body = {
                questions: [
                    {
                        questionText: 'who was in paris?',
                        correctAnswer: 'french',
                        options: [
                            'french',
                            'british',
                            'croissant'
                        ]
                    }
                ],
                _id: e2eQuizId
            }
            return await request(app)
                .post(`/api/v1/quiz/${e2eQuizId}`)
                .send(body)
                .expect(200)
        });

        it('should returns 500, missing questions arrray', async () => {
            const body = {                
                _id: e2eQuizId
            }
            return await request(app)
                .post(`/api/v1/quiz/65d16c2f452dff7be7d7c0e9`)
                .send(body)
                .expect(500)
        });
    
    })
        
    describe('POST /delete', () => {
        
        it('should return 400, invalid id', async () => {
            return await request(app)
                .post('/api/v1/delete')
                .send({id: 'invalid id'})
                .expect(400)
                .expect({message: 'invalid id'})
        });

        it('should return 404, quiz not found', async () => {
            return await request(app)
                .post('/api/v1/delete')
                .send({id: generateObjectId()})
                .expect(404)
                .expect({message: 'quiz not found'})
        });
        it('should returrn 200, deletes the quiz', async () => {
            // create the quiz first
            const quiz = {
                title: 'e2e_test',
                authorId,
                createdBy: 'jade lazo',
                questions: [
                    {
                        questionText: 'who was in paris?',
                        correctAnswer: 'french',
                        options: [
                            'french',
                            'british',
                            'croissant'
                        ]
                    }
                ]
            }
            return await request(app)
                // create the quiz first
                .post('/api/v1/')
                .set('Cookie', `${sessionCookie}`)
                .withCredentials(true)
                .send(quiz)
                .expect(201)
                .then(async (res) => {
                    // then deletes it
                    const {_id} = res.body
                    return request(app)
                        .post('/api/v1/delete/')
                        .send({id: _id})
                        .expect(200)
                        .expect(res.body)
                })
        })
        
    });




  });