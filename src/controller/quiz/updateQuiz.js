const Quiz = require("../../db/Schema/QuizSchema");

// add a auth middleware here, use req.session.user.id and req.params
// TODO: does this work on no cookie env?
async function updateQuiz(req, res) {
    if (!req.session?.user) {
        res.status(400).send({ message: "user not logged in" });
        return;
    }

    const {  _id: quizId, authorId, ...rest} = req.body

    const sessionUserId = req.session.user.id;

    // console.log(authorId, sessionUserId)
    if (authorId !== sessionUserId) {
        res.status(401).send({ message: "unauthorized" });
        return;
    }

    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, rest);
        res.status(201).send(updatedQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'something went wrong'});
    }
}

module.exports = updateQuiz;
