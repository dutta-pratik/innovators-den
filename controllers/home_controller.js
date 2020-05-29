const User = require("../models/user");
const Post = require("../models/post");


module.exports.index = async function(req, res){
    let user = await User.find({});
    let loggedinUser = await req.user;
    let posts = await Post.find({})
    .populate("user");
    
    return res.render("index", {
        title: "Innovators",
        posts: posts,
        users: user,
        loggedUser: loggedinUser
    });
}