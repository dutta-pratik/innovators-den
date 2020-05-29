const User = require("../models/user");
const Post = require("../models/post");
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
}

module.exports.createSession = async function(req, res){
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

module.exports.myFeeds = async function(req, res){
    try{
        if(!req.isAuthenticated()){
            return res.redirect("/");
        }
        let posts = await Post.find({})
        .sort("-createdAt")
        .populate("user");
        let pref = [];
        for(let i=0; i<req.user.my_preference.length; i++){
            pref.push(req.user.my_preference[i]);
        }
        return res.render("my_feeds", {
            posts: posts,
            pref: pref,
            loggedUser: req.user
        });
    }catch(err){
        console.log("Error in my Feeds --> ", err);
        return;
    }
    
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

module.exports.myProfile = async function(req, res){
    try{
        if(!req.isAuthenticated()){
            return res.redirect("/");
        }
        let user = req.user;
        console.log(user);
        return res.render("my_profile",{
            user: user
        });
    }catch(err){
        console.log("error in profile page---> ", err);
        return;
    }
}

module.exports.saveProfile = async function(req, res){
    try{
        if(!req.isAuthenticated()){
            return res.redirect("/");
        }
        let user = await User.findOne({_id: req.user._id});
        console.log(req.body);
        if(user){
            user.first_name = req.body.firstname,
            user.second_name = req.body.secondname,
            user.my_preference = req.body.interest,
            await user.save();
        }
        req.flash("success", "Profile Saved");
        return res.redirect("/");
    }catch(err){
        console.log("Error in saving profile--> ", err);
        return;
    }
}

module.exports.memberList = async function(req, res){
    try{
        if(!req.isAuthenticated()){
            return res.redirect("/");
        }
        let user = await User.find({});
        // console.log("logged", req.user);          
        return res.render("memberlist", {
            user: user,
            loggedUser: req.user
        });
    }catch(err){
        console.log("Error in fetching member list--> ", err);
        return;
    }
}

module.exports.followMember = async function(req, res){
    try{
        let currentUser = req.user;
        let userFollow = req.params.id;
        let isUser = await User.findOne({_id: userFollow});
        if(isUser){
            currentUser.follow.push(userFollow);
            await currentUser.save();
            isUser.follower.push(currentUser._id);
            await isUser.save();
            return res.redirect("/users/member_list");
        }

    }catch(err){
        console.log("Error in following member--> ", err);
        return;
    }
}

module.exports.unfollowMember = async function(req, res){
    try{
        let currentUser = req.user;
        console.log(currentUser);
        let userUnFollow = req.params.id;
        let isUser = await User.findOne({_id: userUnFollow});
        if(isUser){
            currentUser.follow = await currentUser.follow.filter(function(id){
                return id != userUnFollow;
            });
            await currentUser.save();
            isUser.follower = await isUser.follower.filter(function(id){
                return !(id.equals(currentUser._id));
            });
            await isUser.save();
            return res.redirect("/users/member_list");
        }
    }catch(err){
        console.log("Error in following member--> ", err);
        return;
    }
}

module.exports.personalQuestion = async function(req, res){
    try{
        let user = await User.findOne({_id: req.user._id}).populate("question_sent").populate("question_recieved");
        let specificPostSent = await user.question_sent;
        let postRecieved = await user.question_recieved;
        return res.render("personal_que", {
            specificPostSent,
            postRecieved,
            loggedUser: req.user
        });
    }catch(err){
        console.log("Error in following member--> ", err);
        return;
    }
}