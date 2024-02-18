const { Types } = require('mongoose')

function generateObjectId() {
    return new Types.ObjectId().toHexString()
}

module.exports = {
    generateObjectId
}