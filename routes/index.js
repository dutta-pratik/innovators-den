const express = require("express");

const router = express.Router();

//require controller
const homeController = require("../controllers/home_controller");

router.get("/", homeController.index);

router.use("/users", require("./users"));

router.use("/password", require("./password"));

router.use("/post", require("./post"));

router.use("/answer", require("./answer"));

module.exports = router;