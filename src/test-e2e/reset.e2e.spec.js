const request = require('supertest')
const app = require('../app')
const mongoDB = require('../lib/testHelpers/mongoDb')
const { sessionStore } = require('../db/index')





describe('Reset route', () => {
    
    beforeAll(async () => {
        await mongoDB.connect();
    });

    afterAll(async () => {
        await mongoDB.disconnect();
        await sessionStore.close()
    });


    describe('POST /', () => {

        it('should return 400, missing email address', async () => {
            return await request(app)
                .post('/api/v1/reset')
                .send({})
                .expect(400)
                .expect({message: 'provide email address'})


        });

        it('should return 400, email does not exist', async () => {
            return await request(app)
                .post('/api/v1/reset')
                .send({email: 'fakeEmail@email.com'})
                .expect(400)
                .expect({message: 'incorrect email'})


        });

        it('should return 201, with no cookie', async () => {
            return await request(app)
                .post('/api/v1/reset')
                .send({email: 'oneabove232@gmail.com'})
                .expect(201)
                .expect({message: 'reset code sent to email'})
        });


    })

    describe('/verify', () => {
        
        it('should return 400, no code in body', async () => {
            return await request(app)
                .post('/api/v1/reset/verify')
                .send({})
                .expect(400)
                .expect({message: 'missing credentials'})
        });

        it('should return 400, no cookie codeId', async () => {
            return await request(app)
                .post('/api/v1/reset/verify')
                .send({code: '123456'})
                .expect(400)
                .expect({message: 'missing credentials'})
        });

        it('should return 400, codeId on cookie incorrect', async () => {
            return await request(app)
                .post('/api/v1/reset/verify')
                .set('Cookie', 'codeId=incorrect_codeId')
                .send({code: '123456'})
                .expect(400)
                .expect({message: 'incorrect credentials'})
        });                

    });


    describe('/confirm', () => {
        
        it('should return 400, when missing credentials', async () => {
            return Promise.all([
                request(app)
                    .post('/api/v1/reset/confirm')
                    .send({ // not id
                        email: 'e@email.com',
                        password: 'Password123'
                    })
                    .expect(400)
                    .expect({message: 'bad request'}),
                request(app)
                    .post('/api/v1/reset/confirm')
                    .send({ // no email
                        _id: 'someid',
                        password: 'Password123'
                    })
                    .expect(400)
                    .expect({message: 'bad request'}),      
                request(app)
                    .post('/api/v1/reset/confirm')
                    .send({ // no password
                        _id: 'someid',
                        email: 'e@email.com',
                    })
                    .expect(400)
                    .expect({message: 'bad request'}),
            ])
        });

        it('should return 400, when invalid passworrd', async () => {
            return Promise.all([
                request(app)
                    .post('/api/v1/reset/confirm')
                    .send({
                        _id: 'someid',
                        email: 'e@email.com',
                        password: 'Sh0rt' // too short
                    })
                    .expect(400)
                    .expect({message: 'invalid password'}),
                request(app)
                    .post('/api/v1/reset/confirm')
                    .send({ // no email
                        _id: 'someid',
                        email: 'e@email.com',
                        password: 'NoNumbers' // not numeric value
                    })
                    .expect(400)
                    .expect({message: 'invalid password'}),      
                request(app)
                    .post('/api/v1/reset/confirm')
                    .send({ // no password
                        _id: 'someid',
                        email: 'e@email.com',
                        password: 'Has$ymbol' // has special chars
                    })
                    .expect(400)
                    .expect({message: 'invalid password'}),
            ])
        });

        it('should return 400, invalid id', async () => {
            return await request(app)
                .post('/api/v1/reset/confirm')
                .send({
                    _id: 'invalid_id',
                    email: 'e@email.com',
                    password: 'Password123'
                })
                .expect(400)
                .expect({message: 'invalid id'})
        });

    });

});