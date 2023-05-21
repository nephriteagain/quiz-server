const { Router } = require('express')
const mongoose = require('mongoose')
const Quiz = require('../../db/Schema/QuizSchema')

const router = Router()

router.use( '/:id', (req, res, next) => {
  if (!req.params?.id) {
    res.status(401).send({message: 'unauthorized'})
  }
  
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({message: 'invalid id'})
  }
  
  next()
})

router.get('/:id', async (req, res) => {
  const id = req.params.id

  try {
    const allUserQuiz = await Quiz.find({authorId: id})
    res.status(200).send(allUserQuiz)

  } catch (error) {
    res.status(500).send(error)
  }
   
})

module.exports = router