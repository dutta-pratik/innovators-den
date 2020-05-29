const express = require("express");

const router = express.Router();

//require controller
const answerController = require("../controllers/answer_controller");

router.post("/add/:id", answerController.addAnswer);

module.exports = router;