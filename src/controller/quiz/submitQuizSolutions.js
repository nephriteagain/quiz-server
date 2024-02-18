const Quiz = require("../../db/Schema/QuizSchema");
const mongoose = require("mongoose");

async function submitQuizSolutions(req, res) {
    const id = req.params.id;
    const answeredQuestions = req.body.questions;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).send({ message: "Invalid ID" });
        return
    }

    try {
        const quiz = await Quiz.findOne({ _id: id });
        const quizQuestions = [...quiz.questions];

        let checkedQuizQuestion = [];
        quizQuestions.forEach((item, index) => {
            if (
                item.correctAnswer ===
                answeredQuestions[index].correctAnswer
            ) {
                checkedQuizQuestion.push({
                    ...answeredQuestions[index],
                    userAnswer: answeredQuestions[index].correctAnswer,
                    userCorrect: true,
                    options: item.options,
                });
            } else {
                checkedQuizQuestion.push({
                    ...answeredQuestions[index],
                    userAnswer: answeredQuestions[index].correctAnswer,
                    userCorrect: false,
                    correctAnswer: item.correctAnswer,
                    options: item.options,
                });
            }
        });
        res.status(200).send(checkedQuizQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "error" });
    }
}

module.exports = submitQuizSolutions;
