const mongoose = require("mongoose");
const Quiz = require("../../db/Schema/QuizSchema");

async function getQuiz(req, res) {
    const id = req.params.id;
    if (mongoose.Types.ObjectId.isValid(id)) {
        try {
            const quiz = await Quiz.findOne({ _id: id });
            // res.status(200).send(quiz)
            const noAnswers = quiz.questions.map((q) => {
                const { questionText, options, _id } = q;
                return { questionText, options, _id };
            });
            const newQuiz = { ...quiz, questions: noAnswers };
            res.status(200).send(newQuiz._doc);
            return;
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "something went wrong"});
            return;
        }
    } else {
        res.status(404).send({ message: "Invalid ID" });
        return;
    }
}

module.exports = getQuiz;
