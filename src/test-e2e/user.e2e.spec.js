const request = require('supertest')
const app = require('../app')
const mongoDB = require('../lib/testHelpers/mongoDb')
const {
    sessionCookie, 
} = require('./helpers')
const { generateObjectId } = require('../lib/testHelpers/generateObjectId')


describe('User', () => {
    

    beforeAll(async () => {
        await mongoDB.connect();
    });

    afterAll(async () => {
        await mongoDB.disconnect();
    });

    describe('GET /session', () => {
        
        it('should return 200, session: false', async () => {
            return await request(app)
                .get('/api/v1/user/session/')
                .expect(200)
                .expect({session: false})
        });
        it('should return 200, with user data', async () => {
                const user = {
                    "id": "65d16c2f452dff7be7d7c0e9",
                    "email": "oneabove232@gmail.com",
                    "firstName": "jade",
                    "lastName": "lazo",
                  }

            return await request(app)
                .get('/api/v1/user/session/')
                .set('Cookie', `${sessionCookie}`)
                .expect(200)
                .expect({session:true, user})
        });

    });

    describe('POST /signup', () => {
        
        it('should return 401, password !== confirmPass', async () => {
            return await request(app)
                .post('/api/v1/user/signup')    
                .send({
                    password: 'Password123', 
                    confirmPass: '123Password'
                })
                .expect(401)
                .expect({message: 'password does not match'})
        });


        it('should return 409, user already exist', async () => {
            const user = {
                email: 'email@email.com',
                firstName: 'jade',
                lastName: 'lazo',
                password: 'JadeLazo123',
                confirmPass: 'JadeLazo123'
            }

            return await request(app)
                .post('/api/v1/user/signup')
                .send(user)
                .expect(409)
                .expect({message: 'conflict'})
        });

        it('should return 201, creates a new user', async () => {
            const user = {
                email: `${generateObjectId()}@email.com`,
                firstName: 'jade',
                lastName: 'lazo',
                password: 'JadeLazo123',
                confirmPass: 'JadeLazo123'
            }

            return await request(app)
                .post('/api/v1/user/signup')
                .send(user)
                .expect(201)
        });

    });



});

