const { generateCode, generateRandomString } = require('./codeGenerator')

describe('generateCode', () => {

    it('generates a six digit string code', () => {
        const newCode = generateCode()
        expect(typeof newCode).toBe('string')
        expect(newCode).toHaveLength(6)
    })

    it('generates a unique code each time', () => {
        const codeArray = new Array({length:10_000}, () => generateCode())
        for (let i = 0; i < codeArray.length; i++) {
            const code = codeArray[i]
            const isCodeHasDuplicate = codeArray.some((c,idx) => c === code && idx !== i)
            expect(isCodeHasDuplicate).toBeFalsy()
        }
    })

})

describe('generateRandomString', () => {

    it('genrates a 12 character string', () => {
        const randomStr = generateRandomString();
        expect(typeof randomStr).toBe('string')
        expect(randomStr).toHaveLength(12)
    })

    it('generates a unique code each time', () => {
        const codeArray = new Array({length:10_000}, () => generateRandomString())
        for (let i = 0; i < codeArray.length; i++) {
            const code = codeArray[i]
            const isCodeHasDuplicate = codeArray.some((c,idx) => c === code && idx !== i)
            expect(isCodeHasDuplicate).toBeFalsy()
        }
    })
})