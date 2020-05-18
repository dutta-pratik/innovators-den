const User = require("../models/user");
const Post = require("../models/post");


module.exports.index = async function(req, res){
    let posts = await Post.find({})
    .sort("-createdAt")
    .populate("user");
    return res.render("index", {
        title: "QnA for Developers",
        posts: posts
    });
}