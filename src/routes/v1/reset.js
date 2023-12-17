const { Router } = require("express");

const resetPassword = require("../../controller/reset/resetPassword");
const verify = require("../../controller/reset/verify");
const confirm = require("../../controller/reset/confirm");

require("dotenv").config();

const router = Router();

router.post("/", resetPassword);
router.post("/verify", verify);
router.post("/confirm", confirm);

module.exports = router;
