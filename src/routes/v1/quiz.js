const { Router }  = require('express')
const mongoose = require('mongoose')
const Quiz = require('../../db/Schema/QuizSchema')

const router = Router()

router.get('/', async (req, res) => {
  
  const title = req.query.title || ""
  const author = req.query.author || ''
  const pageToSkip = parseInt(req.query.page - 1) || 0

  const sortByDate = req.query.date ? {createdAt: req.query.date} : {createdAt: -1}
  const skipPerPage = 16 * pageToSkip
  const itemLimit = 12

  if (!title && !author ) {
    try {
      const allQuizzes = await Quiz
      .find()
      .sort(sortByDate)
      .skip(skipPerPage)
      .limit(itemLimit)
      .exec()

      const dataToSend = allQuizzes.map((item) => {
        const {_id, title, createdBy, votes = 0} = item
        return {_id, title, createdBy, votes}
      })
      res.status(200).send(dataToSend)
    } catch (error) {
      res.status(500).send(error)
    }
    
  } 
  else if (title) {
    const titleRegex = new RegExp(title, 'gi');
    try {
      const titleSearchedQuiz = await Quiz
      .find({title: titleRegex})
      .sort({title: 1})
      .skip(skipPerPage)
      .limit(itemLimit)
      .exec()

      const dataToSend = titleSearchedQuiz.map((item) => {
        const {_id, title, createdBy} = item
        return {_id, title, createdBy}
      })
      res.status(200).send(dataToSend)
    } catch (error) {
      res.status(500).send(error)
    }
    
  }
  else if (author) {
    const authorRegex = new RegExp(author, 'gi')

    try {
      const authorSearchedQuiz = await Quiz
      .find({createdBy: authorRegex})
      .sort({createdBy: 1})
      .skip(skipPerPage)
      .limit(itemLimit)
      .exec()

      const dataToSend = authorSearchedQuiz.map((item) => {
        const {_id, title, createdBy} = item
        return {_id, title, createdBy}
      })
      res.status(200).send(dataToSend)
    } catch (error) {
      res.status(500).send(error)
    }
  } else {
    res.status(500).send(error)
  }
    
})




router.get('/quiz/:id', async (req, res) => {
    const id = req.params.id
    if (mongoose.Types.ObjectId.isValid(id)) {
        try {
            const quiz = await Quiz.findOne({_id: id})
            // res.status(200).send(quiz)
            const noAnswers = quiz.questions.map(q => {
              const {questionText, options, _id} = q
              return {questionText, options, _id}
            })
            const newQuiz = {...quiz, questions: noAnswers}
            res.status(200).send(newQuiz._doc)
        } catch (error) {
            res.status(500).send(error)
        }
    } else {
        res.status(404).send({message: 'Invalid ID'})
    }
})

// TODO: fix this shit
function checkCredentials(req, res, next) {
  // if (!req.session.user) {
  //   res.status(401).send({message: 'unauthorized'})
  //   return
  // }
  // if (req.body.authorId !== req.session.user.id) {
  //   res.status(401).send({message: 'unauthorized'})
  //   return
  // }
  
  next()
}



router.post('/', checkCredentials ,async (req, res) => {
    const quiz = new Quiz(req.body)

    
    
    try {
        await Quiz.create(quiz) 
        res.status(201).send(quiz)
    } catch (error) {
        res.status(400).send(error)
    }
    
})

// fix this
router.post('/quiz/:id', async (req, res) => {
  const id = req.params.id
  const answeredQuestions = req.body.questions

  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      const quiz = await Quiz.findOne({_id: id})
      const quizQuestions = [...quiz.questions]

      let checkedQuizQuestion = []
      quizQuestions.forEach((item, index) => {
        if (item.correctAnswer === answeredQuestions[index].correctAnswer) {
          checkedQuizQuestion.push(
            {
              ...answeredQuestions[index],
              userAnswer: answeredQuestions[index].correctAnswer,
              userCorrect: true, 
              options: item.options
            }
          )
        } else {
         checkedQuizQuestion.push(
            {
              ...answeredQuestions[index],
              userAnswer: answeredQuestions[index].correctAnswer,
              userCorrect: false,            
              correctAnswer: item.correctAnswer, 
              options: item.options,
            } 
          )
        }
      })
  

      res.status(200).send(checkedQuizQuestion)
    } catch (error) {
        res.status(500).send({message: 'error'})
    }
} else {
    res.status(400).send({message: 'Invalid ID'})
}
})

router.post('/delete', async (req, res) => {
  const id = req.body.id

  // if invalid id response 400
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({message: 'invalid id'})
  }

  const deletedQuiz = await Quiz.findByIdAndDelete(id)
    .then((response) => {
      res.status(200).send(response)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
  
})

// add a auth middleware here, use req.session.user.id and req.params
router.post('/update/:id', async(req, res) => {

  if (!req.session?.user) {
    res.status(400).send({message: 'user not logged in'})
    return
  }

  const quizId = req.body._id
  const authorId = req.body.authorId
  const  sessionUserId = req.session.user.id

  // console.log(authorId, sessionUserId)
  if (authorId !== sessionUserId) {
    res.status(400).send({message: 'unauthorized'})
  }

  const updatedQuiz =  Quiz.findByIdAndUpdate(quizId, req.body)
    .then(response => {
      res.status(201).send(response)
    })
    .catch(err => res.status(500).send(err))
})




module.exports = router