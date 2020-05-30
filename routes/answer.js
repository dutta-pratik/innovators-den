const express = require("express");

const router = express.Router();

//require controller
const answerController = require("../controllers/answer_controller");

router.post("/add/:id", answerController.addAnswer);

router.get("/like/:id", answerController.likeAnswer);

router.get("/dislike/:id", answerController.dislikeAnswer);

module.exports = router;