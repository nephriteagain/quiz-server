const { generateObjectId } = require('../../testHelpers/generateObjectId')
const { rateLimitChecker } = require('./index')
const rateLimiter = require('./rateLimiter')
jest.mock('./rateLimiter')

describe('rateLimitChecker', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    const next = jest.fn();

    it('no id on cookie, executes createNewRateLimitSession', async () => {
        jest.spyOn(rateLimiter, 'createNewRateLimitSession').mockReturnValueOnce('')
        const req = {
            cookies: {}
        }
        const res = {};
        await rateLimitChecker(req,res,next)
        expect(rateLimiter.createNewRateLimitSession).toHaveBeenCalled()
    })

    it('invalid id on cookie, executes createNewRateLimitSession', async () => {
        jest.spyOn(rateLimiter, 'createNewRateLimitSession').mockReturnValueOnce('')
        const req = {
            cookies: {
                id: 'invalid id'
            }
        }
        const res = {};
        await rateLimitChecker(req,res,next)
        expect(rateLimiter.createNewRateLimitSession).toHaveBeenCalled()
    })

    it('has timeout cookie', async () => {
        jest.spyOn(rateLimiter, 'timeoutUser').mockReturnValueOnce('')
        const req = {
            cookies: {
                id: generateObjectId(),
                timeOut: 'timeout'
            }
        }
        const res = {};
        await rateLimitChecker(req,res, next)
        expect(rateLimiter.timeoutUser).toHaveBeenCalled()
    })

    it('has valid id, update the rate limit', async () => {
        jest.spyOn(rateLimiter, 'updateRateLimitSession').mockReturnValueOnce('')
        const req = {
            cookies: {
                id: generateObjectId()
            }
        }
        const res = {};
        await rateLimitChecker(req,res,next)
        expect(rateLimiter.updateRateLimitSession).toHaveBeenCalled()
    })
    
})