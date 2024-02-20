require('dotenv').config()
const mongoose = require('mongoose')

module.exports = {
    mongoose,
    connect: async () => {
      mongoose.Promise = Promise;
      await mongoose.connect(process.env.MONGO_URI);
      console.log('connected to db')
    },
    disconnect: async () => {
      await mongoose.connection.close();
      console.log('disconnected to db')      
    }
  };