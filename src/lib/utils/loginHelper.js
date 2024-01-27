const bcrypt = require("bcryptjs");

/**
 * 
 * @param {string} password user provided password
 * @returns {string} a hashed password
 */
function hashPassword(password) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

/**
 * 
 * @param {string} raw plain password
 * @param {string} hash hashed password
 * @returns {boolean}
 */
function comparePassword(raw, hash) {
    return bcrypt.compareSync(raw, hash);
}

module.exports = {
    hashPassword,
    comparePassword,
};
