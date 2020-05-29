const User = require("../models/user");
const Post = require("../models/post");
const Answer = require("../models/answer");

module.exports.addAnswer = async function(req, res){
    try{
        let postId = await req.params.id;
        let post = await Post.findOne({_id: postId});
        // console.log("addAnswer", req.body);
        if(post){
            let answer = await Answer.create({
                ans: req.body.ans,
                post: postId,
                user: req.user._id
            });

            post.ans.push(answer._id);

            await post.save();
        }
        req.flash("success", "Answer Posted!");
        return res.redirect("back");
    }catch(err){
        console.log("error in adding answer --> ", err);
        return;
    }
}