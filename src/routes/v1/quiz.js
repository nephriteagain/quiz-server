const { Router } = require("express");

const router = Router();

const getQuizzes = require("../../controller/quiz/getQuizzes");
const getQuiz = require("../../controller/quiz/getQuiz");
const {
    checkCredentials,
    createQuiz,
} = require("../../controller/quiz/createQuiz");
const submitQuizSolutions = require("../../controller/quiz/submitQuizSolutions");
const deleteQuiz = require("../../controller/quiz/deleteQuiz");
const updateQuiz = require("../../controller/quiz/updateQuiz");

router.get("/", getQuizzes);
router.get("/quiz/:id", getQuiz);
router.post("/", checkCredentials, createQuiz);
// fix this, update:already fixed?
router.post("/quiz/:id", submitQuizSolutions);
router.post("/delete", deleteQuiz);
router.post("/update/:id", updateQuiz);

module.exports = router;
