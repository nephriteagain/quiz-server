require('dotenv').config()
const mongoose = require('mongoose')

module.exports = {
    mongoose,
    connect: () => {
      mongoose.Promise = Promise;
      mongoose.connect(process.env.MONGO_URI);
    },
    disconnect: done => {
      mongoose.disconnect(done);
    }
  };