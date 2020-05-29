const express = require("express");

const router = express.Router();

const postController = require("../controllers/post_controller");

router.post("/createpost", postController.createPost);

router.get("/view/:id", postController.viewPost);

module.exports = router;