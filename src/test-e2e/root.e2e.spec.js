const request = require('supertest')
const app = require('../app')
const mongoDB = require('../lib/testHelpers/mongoDb')

describe("Test the root path", () => {
    beforeAll(async () => {
        await mongoDB.connect();
    });

    afterAll(async () => {
        await mongoDB.disconnect();
    });

    it("It should response the GET method", async () => {
        return await request(app)
        .get("/")
        .expect(200);

    });
    

  });