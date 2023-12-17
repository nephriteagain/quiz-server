const Quiz = require("../../db/Schema/QuizSchema");
const mongoose = require("mongoose");

// TODO: need to verify if the user owns the quiz first!
async function deleteQuiz(req, res) {
    const id = req.body.id;

    // if invalid id response 400
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).send({ message: "invalid id" });
    }
    try {
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        res.status(200).send(deletedQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).send(err);
    }
}

module.exports = deleteQuiz;
