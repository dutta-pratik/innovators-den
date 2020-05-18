const express = require("express");
const passport = require("passport");
const router = express.Router();

const userController = require("../controllers/user_controller");

//signin page
router.use("/signin", userController.signIn);

//signin the user
router.post("/createsession", passport.authenticate(
    "local",
    {failureRedirect: "/users/signin"},

),userController.createSession);

//signup using google
router.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));
router.get("/auth/google/callback", passport.authenticate("google", {failureRedirect: "/users/signin"}), userController.createSession);

//sign up manually
router.post("/create", userController.createUser);



//create new user page
router.get("/createnew", userController.createNew);

router.get("/myfeeds", userController.myFeeds);

router.get("/signout", userController.signOut);

router.get("/confirm/:userID/:code", userController.confirmEmail);

router.get("/profile", userController.myProfile);

router.post("/save_profile", userController.saveProfile);

router.get("/member_list", userController.memberList);

module.exports = router;