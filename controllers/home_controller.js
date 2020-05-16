const User = require("../models/user");
const Post = require("../models/post");


module.exports.index = function(req, res){
    return res.render("index", {
        title: "QnA for Developers"
    });
}