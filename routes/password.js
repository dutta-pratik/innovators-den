const express = require("express");
const passport = require("passport");
const router = express.Router();

const passwordController = require("../controllers/password_controller");

router.get("/resetpassword", passwordController.resetPasswordPage);
router.post("/reset", passwordController.resetPassword);
router.post("/check_code/:mail", passwordController.checkCode);

module.exports = router;