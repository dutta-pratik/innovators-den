const Post = require("../models/post");
const User = require("../models/user");

module.exports.createPost = async function(req, res){
    try{
        console.log(req.user);
        // console.log(locals.user);
        console.log(req.body);
        if(req.body.interest == null){
            req.flash("error", "Select Atleast one TAG");
            return res.redirect("/");
        }

        let post = await Post.create({
            post: req.body.post,
            user: req.user._id,
            question_to: req.body.question_to,
            interest: req.body.interest
        });

        if(post){
            let user = await User.findOne({_id: req.user._id});
            user.post.push(post._id);
            await user.save();
            req.flash("success", "Post Published");
            return res.redirect("/");
        }
        
        
    }catch(err){
        console.log("Error in Creating Post", err);
    }
}