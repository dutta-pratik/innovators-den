const User = require("../models/user");

module.exports.signIn =  function(req, res){
     //if user is already sign in
     if(req.isAuthenticated()){
        return res.redirect("/");
    }
    return res.render("sign-in", {
        sign:"Sign In",
    });
    // console.log(req.body);
    // return res.render("sign-in", {
    //     sign:"Sign In",
    // });
}

module.exports.createSession = async function(req, res){
    // try{
    //     let user = await User.findOne({email: req.body.email});
    //     if(user){
    //         if(user.password == req.body.password){
    //             console.log("User sign in successfull");
    //             console.log(res.locals);
    //             return res.redirect("/");
    //         }else{
    //             console.log("Email or Password is invalid");
    //             return res.redirect("/users/signin");
    //         }
    //     }else{
    //         console.log("User not Exists");
    //         return res.redirect("/users/signin");
    //     }
    // }catch(err){
    //     console.log("Error in Signing up the user ------> ", err);
    //     return;
    // }
    console.log("Logged in Successfull");
    return res.redirect("/");
}

module.exports.createUser = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});
        if(user){
            console.log("User is already existed");
            return res.redirect("/users/signin");
        }else{
            if(req.body.password == req.body.confirmpassword){
                User.create({
                    email: req.body.email,
                    password: req.body.password
                }, function(err, user){
                    if(err){console.log("Error in creating new User ----->", err); return;}
                    console.log("User Successfully Created");
                    return res.redirect("/users/signin");
                });
            }
        }

    }catch(err){
        console.log("Error in createUser -----> ", err);
    }
}

module.exports.resetPassword =  function(req, res){
    console.log(req.body);
    return res.render("reset_password", {
        
    });
}

module.exports.createNew =  function(req, res){
    console.log(req.body);
    return res.render("create_new", {
        
    });
}

module.exports.myFeeds = function(req, res){
    console.log(req.body);
    return res.render("my_feeds", {
        
    });
}

module.exports.signOut = function(req, res){
    req.logout();
    return res.redirect("/");
}