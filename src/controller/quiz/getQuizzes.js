const Quiz = require("../../db/Schema/QuizSchema");

async function getQuizzes(req, res) {
    const title = req.query.title || "";
    const author = req.query.author || "";
    const pageToSkip = parseInt(req.query.page - 1) || 0;

    const sortByDate = req.query.date
        ? { createdAt: req.query.date }
        : { createdAt: -1 };
    const skipPerPage = 16 * pageToSkip;
    const itemLimit = 12;

    if (!title && !author) {
        try {
            const allQuizzes = await Quiz.find()
                .sort(sortByDate)
                .skip(skipPerPage)
                .limit(itemLimit)
                .exec();

            const dataToSend = allQuizzes.map((item) => {
                const { _id, title, createdBy, votes = 0 } = item;
                return { _id, title, createdBy, votes };
            });
            res.status(200).send(dataToSend);
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "something went wrong"});
        }
        return
    } 

    if (title) {
        const titleRegex = new RegExp(title, "gi");
        try {
            const titleSearchedQuiz = await Quiz.find({ title: { '$regex': titleRegex } })
                .sort({ title: 1 })
                .skip(skipPerPage)
                .limit(itemLimit)
                .exec();

            const dataToSend = titleSearchedQuiz.map((item) => {
                const { _id, title, createdBy } = item;
                return { _id, title, createdBy };
            });
            res.status(200).send(dataToSend);
        } catch (error) {
            console.error(error);
            res.status(500).send({message: 'something went wrong'});
        }
        return
    } 

    if (author) {
        const authorRegex = new RegExp(author, "gi");

        try {
            const authorSearchedQuiz = await Quiz.find({
                createdBy: {'$regex': authorRegex},
            })
                .sort({ createdBy: 1 })
                .skip(skipPerPage)
                .limit(itemLimit)
                .exec();

            const dataToSend = authorSearchedQuiz.map((item) => {
                const { _id, title, createdBy } = item;
                return { _id, title, createdBy };
            });
            res.status(200).send(dataToSend);
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "something went wrong"});
        }
        return
    }
    res.status(500).send('this will never be reached');
    return
}

module.exports = getQuizzes;
