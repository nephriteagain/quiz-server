/**
 * @description generates a random 6 digit numeric string
 * @returns {string} a 6 digit numberic string
 */
function generateCode() {
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}

/**
 * @description generate a 12 character alphanumeric string
 * @returns {string} an alphanumeric string
 */
function generateRandomString() {
    const characters =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const length = 12;
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
    }
    return result;
}

module.exports = { generateCode, generateRandomString };
