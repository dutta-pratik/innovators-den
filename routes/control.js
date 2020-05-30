const express = require("express");

const router = express.Router();

const controlController = require("../controllers/control_controller");

router.get("/like/:id", controlController.like);

router.get("/dislike/:id", controlController.dislike);

router.use("/ans", require("./answer"));

module.exports = router;