const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    post:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    question_to:{
        type:String
    },
    interest:[{
        type:String
    }]

});


const Post = mongoose.model("Post", postSchema);
module.exports = Post;