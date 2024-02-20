const Quiz = require("../../db/Schema/QuizSchema");

function checkCredentials(req, res, next) {
    // user not logged in
    if (!req.session.user) {        
        res.status(401).send({ message: "unauthorized" });
        return;
    }
    // user pretending to be other
    if (req.body.authorId !== req.session.user.id) {
        res.status(401).send({ message: "forbidden" });
        return;
    }

    next();
}

async function createQuiz(req, res) {
    /**@type {Quiz} */
    const quiz = req.body;    
    try {
        const newQuiz = await Quiz.create(quiz);
        res.status(201).send(newQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'something went wrong'});
    }
}

module.exports = { checkCredentials, createQuiz };


/**
@typedef {Object} Quiz
@property {string} title
@property {string} authorId
@property {string} createdBy
@property {Question[]} questions
*
*/


/**
 * @typedef {Object} Question
 * @property {string} questionText
 * @property {string} correctAnswer
 * @property {string[]} options
 */