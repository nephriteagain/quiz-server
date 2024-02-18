const { 
    rateLimitChecker, 
    createNewRateLimitSession, 
    timeoutUser, 
    updateRateLimitSession 
} = require('./rateLimiter');

const Rate_Limit = require('../../../db/Schema/RateLimitSchema')
const { generateObjectId } = require('../../testHelpers/generateObjectId')


describe('rateLimitChecker', () => {

    describe('timeoutUser', () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res)
        }
        it ('timeouts a user', () => {
            timeoutUser(res)
            expect(res.status).toHaveBeenCalledWith(408)
            expect(res.send).toHaveBeenCalledWith({message: 'cookie, too many request'})
        })
    })

    describe('createNewRateLimitSession', () => {
        const next = jest.fn()
        const res = {
            cookie: jest.fn()
        }
        it ('create a new rate limit session', async () => {
            const _id = generateObjectId()
            jest.spyOn(Rate_Limit, 'create').mockReturnValueOnce({_id})
            await createNewRateLimitSession(res,next)

            expect(next).toHaveBeenCalled()
            expect(res.cookie).toHaveBeenCalledWith(
                "id",
                _id,
                {
                    maxAge: 999_999_999_999,
                    httpOnly: true
                }
            )
        })

        it('catch an error', async () => {
            const mockErr = 'something went wrong'
            jest.spyOn(Rate_Limit, 'create').mockRejectedValueOnce(mockErr)
            const consoleErrorSpy  = jest.spyOn(console, 'error').mockImplementationOnce()
            await createNewRateLimitSession(res,next)
            expect(consoleErrorSpy).toHaveBeenCalledWith(mockErr)
        })
    })

    describe('updateRateLimitSession', () => {
        const next = jest.fn();
        

        it ('creates a new rate limit entry', async () => {            
            const _id = generateObjectId()
            jest.spyOn(Rate_Limit, 'findByIdAndUpdate').mockReturnValueOnce(null)
            jest.spyOn(Rate_Limit, 'create').mockReturnValueOnce({_id})
            const req = {
                method: 'GET'
            }
            const res = {
                cookie: jest.fn()
            }
            await updateRateLimitSession(req,res,next)
            expect(res.cookie).toHaveBeenCalledWith("id", _id, {
                maxAge: 999_999_999_999,
                httpOnly: true
            })
            expect(next).toHaveBeenCalled()
        })

        it('rate limit the user', async () => {
            jest.spyOn(Rate_Limit, 'findByIdAndUpdate').mockReturnValueOnce({
                requestTimes: 101
            })
            const req = {
                method: 'GET'
            }
            const res = {
                cookie: jest.fn(),
                status: jest.fn(() => res),
                send: jest.fn()
            }
            await updateRateLimitSession(req,res,next)
            expect(res.cookie).toHaveBeenCalledWith(
                "timeOut", 
                "wait for a minute", 
                {
                    maxAge: 60_000,
                    httpOnly: true,
                }
            )
            expect(res.status).toHaveBeenCalledWith(408)
            expect(res.send).toHaveBeenCalledWith({ message: "db ,too many request" })
            expect(next).toHaveBeenCalled()
        })

        it('catch the error', async () => {
            const err = 'error'
            jest.spyOn(Rate_Limit, 'findByIdAndUpdate').mockRejectedValueOnce(err)
            const consoleErrorSpy  = jest.spyOn(console, 'error').mockImplementationOnce()
            const req = {
                method: 'GET'
            }
            const res = {
                status: jest.fn(() => res),
                send: jest.fn()
            }
            await updateRateLimitSession(req,res,next)
            expect(consoleErrorSpy).toHaveBeenCalledWith(err)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.send).toHaveBeenCalledWith({ message: "server error" })
            expect(next).toHaveBeenCalled()
        })
    })

    

});


            