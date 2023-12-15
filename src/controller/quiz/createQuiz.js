const Quiz = require('../../db/Schema/QuizSchema')

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

async function createQuiz(req, res) {
    const quiz = new Quiz(req.body)

    try {
        await Quiz.create(quiz) 
        res.status(201).send(quiz)
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }

}

module.exports = { checkCredentials, createQuiz }