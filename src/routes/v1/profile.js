const { Router } = require("express");

const router = Router();

const quizIdValidatorMiddleware = require("../../controller/profile/quizIdValidatorMiddleware");
const getUserQuiz = require("../../controller/profile/getUserQuiz");

router.use("/:id", quizIdValidatorMiddleware);
router.get("/:id", getUserQuiz);

module.exports = router;
