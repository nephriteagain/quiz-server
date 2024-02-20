const request = require('supertest')
const app = require('../app')
const mongoDB = require('../lib/testHelpers/mongoDb')
const {
    e2eUserId
} = require('./helpers')


describe('Profile', () => {

    beforeAll(async () => {
        await mongoDB.connect();
    });

    afterAll(async () => {
        await mongoDB.disconnect();
    });


    describe('GET /:id', () => {
        it('should return 400, invalid id ', async () => {
            return await request(app)
                .get('/api/v1/profile/invalid_id')
                .expect(400)
        });
        it('should return 200', async () => {
            return await request(app)
                .get(`/api/v1/profile/${e2eUserId}`)
                .expect(200)
        })

    });

});