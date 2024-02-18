
const { hashPassword, comparePassword } = require('./loginHelper');

describe('hashPassword', () => { 

    it('hash a given password', () => {
        const pw = 'password'
        const hashedPw = hashPassword(pw)
        expect(typeof hashedPw).toBe('string')
        expect(hashedPw).not.toBe(pw)
    })

})

describe('comparePassword', () => { 

    it('returns true', () => {
        const pw = 'password'
        const hashedPw = hashPassword(pw)

        const isMatched = comparePassword('password', hashedPw)
        expect(isMatched).toBeTruthy()
    })

    it('returns false', () => {
        const pw = 'password'
        const hashedPw = hashPassword(pw)

        const isNotMatched = comparePassword('psswrd', hashedPw)
        expect(isNotMatched).toBeFalsy()
    })
 })
