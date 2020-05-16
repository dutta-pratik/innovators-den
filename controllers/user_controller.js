const User = require("../models/user");
const keyGen = require("random-key");
const nodeMailer = require("../config/nodemailer");


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
    // console.log("Logged in Successfull");
    req.flash("success", "Logged In successfully");
    return res.redirect("/");
}

module.exports.createUser = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});
        if(user){
            // console.log("User is already existed");
            req.flash("error", "User already exists");
            return res.redirect("/users/signin");
        }else{
            if(req.body.password == req.body.confirmpassword){
                let randomKey = keyGen.generate(16);
                User.create({
                    email: req.body.email,
                    password: req.body.password,
                    confirm_mail_code: randomKey
                }, function(err, user){
                    if(err){console.log("Error in creating new User ----->", err); return;}
                    // console.log("User Successfully Created");
                    
                    if(user){
                        //nodemailer
                        let htmlString = nodeMailer.renderTemplate({link: `http://localhost:8000/users/confirm/${user._id}/${user.confirm_mail_code}`}, "/mail_conf_page.ejs");
                
                        nodeMailer.transporter.sendMail({
                           from: 'pratikdutta.786@gmail.com',
                           to: req.body.email,
                           subject: "Email Confirmation",
                           html: htmlString 
                        }, (err, info) => {
                            if (err){
                                console.log('Error in sending mail', err);
                                return ;
                            }
                    
                            // console.log('Message sent', info);
                            return;
                        });
                    }
                    // renders to the page which tells to confirm the email id
                    req.flash("success", "User Successfully Created");
                    req.flash("success", "Check Email for Confirmation");
                    return res.render("confirmation_notification", {
                        email: user.email
                    });
                });
            }
        }

    }catch(err){
        console.log("Error in createUser -----> ", err);
    }
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
    req.flash("success", "Successfully logged out!");
    return res.redirect("/");
}

module.exports.confirmEmail = async function(req, res){
    
    try{
        console.log(req.params.userID);
        console.log(req.params.code);
        let user = await User.findOne({_id: req.params.userID});
        if(user){
            if(user.confirm_mail_status == true){
                // console.log("Already confirmed!");
                req.flash("success", "Already confirmed!");
                return res.redirect("/users/signin");
            }
            if(user.confirm_mail_code == req.params.code){
                user.confirm_mail_status = true;
                await user.save();
                req.flash("success", "Email Confirmed");
                // console.log("Email Confirmed");
            }
            return res.redirect("/users/signin");
        }else{
            req.flash("error", "User doesn't exist");
            // console.log("User with that credentials not exists");
        }
    }catch(err){
        console.log("Error in confirming Email---->", err);
    }

}