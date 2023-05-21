const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('connect to db'))
    .catch((err) => console.log(err))
