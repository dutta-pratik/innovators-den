const passport = require("passport");

const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");

const User = require("../models/user");
// const env = require("./environment");

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: env.google_clientID,
    clientSecret: env.google_clientSecret,
    callbackURL: env.google_callbackURL,
},function(accessToken, refreshToken, profile, done){
    // find a user
    User.findOne({email: profile.emails[0].value}).exec(function(err, user){
        if(err){console.log("Error in Google Auth", err); return;}

        console.log(profile);

        if(user){
            //if found
            return done(null, user);
        }else{
            //if not found create a user
            User.create({
                // name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString("hex")
            }, function(err, user){
                if(err){console.log("Error in creating user using Google Auth", err); return;}
                return done(null, user);
            });
        }

    })
}));

module.exports = passport;