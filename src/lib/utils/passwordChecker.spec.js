const { 
    passwordLengthChecker, 
    passwordCharChecker,  
    specialSymbolChecker,
} = require('./passwordChecker')


describe('passwordLengthChecker', () => {

    it('checks the password if length is 6', () => {
        expect(passwordLengthChecker('abcdef')).toBeTruthy()
        expect(passwordLengthChecker('a')).toBeFalsy()
    })
})

describe('passwordCharChecker', () => {

    it('returns true, password has valid chars', () => {
        const p = 'Password123' // has upper, has lower, has num
        const p2 = 'paSsword11'
        expect(passwordCharChecker(p)).toBeTruthy()
        expect(passwordCharChecker(p2)).toBeTruthy()
    })

    it('returns false, invalid password', () => {
        const p = 'password123' // no upper
        const p2 = 'PASSWORD123' // no lower
        const p3 = 'Password' // no num
        expect(passwordCharChecker(p)).toBeFalsy()
        expect(passwordCharChecker(p2)).toBeFalsy()
        expect(passwordCharChecker(p3)).toBeFalsy()
    })
})

describe('special', () => { 

    it('returns true, does not contain special symbol', () => {
        const p = 'password'
        const p2 = '121212121'
        expect(specialSymbolChecker(p)).toBeTruthy()
        expect(specialSymbolChecker(p2)).toBeTruthy()
    })

    it('returns false, does contain special symbol', () => {
        const p = 'password??'
        const p2 = '121212121!'
        expect(specialSymbolChecker(p)).toBeFalsy()
        expect(specialSymbolChecker(p2)).toBeFalsy()
    })
 })