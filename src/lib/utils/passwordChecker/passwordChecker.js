/**
 * 
 * @param {string} password 
 * @returns {boolean} returns true if password length greater than or equal to 6
 */
function passwordLengthChecker(password) {
    return password.length >= 6;
}

/**
 * @description checks if the password contains the required chars
 * @param {string} password 
 * @returns {boolean} returns true of password has required chars
 */
function passwordCharChecker(password) {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;

    password.split("").forEach((char) => {
        if (char >= "A" && char <= "Z") {
            hasUpper = true;
        } else if (char >= "a" && char <= "z") {
            hasLower = true;
        }
        if (char >= "0" && char <= "9") {
            hasNum = true;
        }
    });

    if (hasUpper && hasLower && hasNum) {
        return true;
    } else {
        return false;
    }
}

/**
 * 
 * @param {string} password 
 * @returns {boolean} returns false if password contains special symbol
 */
function specialSymbolChecker(password) {
    const regex = /[^a-zA-Z0-9]/g;

    if (regex.test(password)) {
        return false;
    } else {
        return true;
    }
}

module.exports = {
    passwordLengthChecker,
    passwordCharChecker,
    specialSymbolChecker,
};
