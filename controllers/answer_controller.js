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

module.exports.likeAnswer = async function(req, res){
    try{
        let answerId = await req.params.id;
        let loggedUser = req.user;
        let answer = await Answer.findOne({_id: answerId});
        if(answer){
            if(answer.dislike.includes(loggedUser._id)){
                answer.dislike = await answer.dislike.filter(function(id){
                    return !(id.equals(loggedUser._id));
                });

                await answer.save();

                answer.like.push(loggedUser._id);

                await answer.save();
                return res.redirect("back");
            }else if(!(answer.like.includes(loggedUser._id))){
                answer.like.push(loggedUser._id);
                await answer.save();
                return res.redirect("back");
            }else{
                console.log("User already like this answer");
                return res.redirect("back");
            }
        }
    }catch(err){
        console.log("Error in liking the answer --> ", err);
        return;
    }
}

module.exports.dislikeAnswer = async function(req, res){
    try{
        let answerId = await req.params.id;
        let loggedUser = req.user;
        let answer = await Answer.findOne({_id: answerId});
        if(answer){
            if(answer.like.includes(loggedUser._id)){
                answer.like = await answer.like.filter(function(id){
                    return !(id.equals(loggedUser._id));
                });

                await answer.save();

                answer.dislike.push(loggedUser._id);

                await answer.save();
                return res.redirect("back");
            }else if(!(answer.dislike.includes(loggedUser._id))){
                answer.dislike.push(loggedUser._id);
                await answer.save();
                return res.redirect("back");
            }else{
                console.log("User already dislike this answer");
                return res.redirect("back");
            }
        }
    }catch(err){
        console.log("Error in disliking the answer --> ", err);
        return;
    }
}