const express = require("express");

const router = express.Router();

const controlController = require("../controllers/control_controller");

router.get("/like/:id", controlController.like);

router.get("/dislike/:id", controlController.dislike);

module.exports = router;