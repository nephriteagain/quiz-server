const mongoose = require('mongoose')

async function quizIdValidatorMiddleware(req,res,next) {
    if (!req.params?.id) {
        res.status(401).send({message: 'unauthorized'})
      }
      
      const id = req.params.id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).send({message: 'invalid id'})
      }
      
      next()
}

module.exports = quizIdValidatorMiddleware