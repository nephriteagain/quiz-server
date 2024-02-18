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
    const quiz = req.body;

    try {
        await Quiz.create(quiz);
        res.status(201).send(quiz);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

module.exports = { checkCredentials, createQuiz };
