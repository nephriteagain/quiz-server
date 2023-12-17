const Quiz = require("../../db/Schema/QuizSchema");

// TODO: check if the user owns the quiz, add constant pagination
async function getUserQuiz(req, res) {
    const id = req.params.id;

    try {
        const allUserQuiz = await Quiz.find({ authorId: id });
        res.status(200).send(allUserQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

module.exports = getUserQuiz;
