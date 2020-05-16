const User = require("../models/user");
const keyGen = require("random-key");
const nodeMailer = require("../config/nodemailer");

module.exports.resetPasswordPage =  function(req, res){
    console.log(req.body);
    return res.render("reset_password_page");
    // return res.redirect("resetpassword");
}

module.exports.resetPassword = async function(req, res){
    console.log(req.body);
    
    let user = await User.findOne({email: req.body.email});
    console.log(user);
    if(user){
        //TODO set an epiry to reset_code field 
        let randCode = keyGen.generateDigits(5);
        console.log(randCode);
        //TODO check if th code is not assigned to anyother user which is not expired
        user.reset_code = randCode;
        user.save();
        console.log(user.email);
        //nodemailer
        let htmlString = nodeMailer.renderTemplate({code: randCode}, "/reset_code_page.ejs");
                
        nodeMailer.transporter.sendMail({
            from: 'pratikdutta.786@gmail.com',
            to: user.email,
            subject: "Innovator Reset Code Request",
            html: htmlString 
        }, (err, info) => {
            if (err){
                console.log('Error in sending mail', err);
                return;
            }
            
            // console.log('Message sent', info);
            return;
        });
        req.flash("success", "Email sent to your mail");
        //should render reset_password here which is at last
        
    }else{
        req.flash("error", "Email ID did not match");
        return res.redirect("resetpassword");
    }

    //render password_reset ejs
    return res.render("reset_password", {
        email: user.email
    });
}

module.exports.checkCode = async function(req, res){
    // console.log(req.body);
    try{
        let user = await User.findOne({email: req.params.mail});
        console.log(user);
        console.log(req.params.mail);
        console.log(req.body.password[0], req.body.password[1]);
        if(req.body.code == user.reset_code){
            console.log("1");
            console.log(user.reset_code, req.body.reset_code);
            if(req.body.password[0] == req.body.password[1]){
                
                console.log("2");
                user.password = req.body.password[0];
                await user.save();
                req.flash("success", "Password reset successfully");
                return res.redirect("/users/signin");
            }else{
                req.flash("error", "Password did not match");
                return res.redirect("/");
            }
            
        }else{
            req.flash("error", "Code did not match");
            return res.redirect("/");
        }
    }catch(err){
        console.log("Error in catch of check code", err);
    }
}