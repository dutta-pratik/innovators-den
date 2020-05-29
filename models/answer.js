const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    ans:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    like:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislike:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]

},{
    timestamps: true
});


const Answer = mongoose.model("Answer", answerSchema);
module.exports = Answer;