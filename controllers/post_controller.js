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
        
        if(post && (req.body.question_to == 'All')){

            let user = await User.findOne({_id: req.user._id});
            user.post.push(post._id);
            await user.save();
            req.flash("success", "Post Published");
            return res.redirect("/");

        }else if(post){

            let user = await User.findOne({_id: req.user._id});
            user.question_sent.push(post._id);
            await user.save();

            let quetospecific = await User.findOne({email: req.body.question_to});
            quetospecific.question_recieved.push(post._id);
            await quetospecific.save();

            req.flash("success", "Post Published");
            return res.redirect("/users/personal_que");

        }
        
        
    }catch(err){
        console.log("Error in Creating Post", err);
        return;
    }
}

module.exports.viewPost = async function(req, res){
    try{
        let postId = await req.params.id;
        let post = await Post.findOne({_id: postId})
        .populate("-createdAt")
        .populate("ans");
        console.log(post);
        if(post){
            return res.render("view_post",{
                post
            });
        }
        
    }catch(err){
        console.log("Error in Creating Post", err);
        return;
    }
}