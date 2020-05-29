const Post = require("../models/post");
const Answer = require("../models/answer");

module.exports.like = async function(req, res){
    try{
        let curUser = await req.user;
        let postId = await req.params.id;
        let post = await Post.findOne({_id: postId});
        if(post){
            if(post.dislike.includes(curUser._id)){
                // console.log("like 1");
                post.dislike = post.dislike.filter(function(id){
                    return !(id.equals(curUser._id));
                });

                await post.like.push(curUser._id);

                await post.save();

                return res.redirect("back");
            }else if(!(post.like.includes(curUser._id))){
                // console.log("like 2");
                await post.like.push(curUser._id);
                await post.save();
                return res.redirect("back");
            }else{
                // console.log("like 3");
                console.log("Post already liked by User");
                return res.redirect("back");
            }
        }
    }catch(err){
        console.log("Error in Liking Post --> ",err);
        return;
    }
}

module.exports.dislike = async function(req, res){
    try{
        let curUser = await req.user;
        let postId = await req.params.id;
        let post = await Post.findOne({_id: postId});
        if(post){
            if(post.like.includes(curUser._id)){
                // console.log("dislike 1");
                post.like = await post.like.filter(function(id){
                    console.log("id",id);
                    console.log("user", curUser._id);
                    return !(id.equals(curUser._id));
                });

                await post.dislike.push(curUser._id);

                await post.save();

                return res.redirect("back");

            }else if(!(post.dislike.includes(curUser._id))){
                // console.log("dislike 2");
                await post.dislike.push(curUser._id);

                await post.save();

                return res.redirect("back");

            }else{
                // console.log("dislike 3");
                console.log("Post already disliked by User");
                return res.redirect("back");
            }
        }
    }catch(err){
        console.log("Error in disliking --> ", err);
        return;
    }
}