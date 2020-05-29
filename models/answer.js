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
    }

},{
    timestamps: true
});


const Answer = mongoose.model("Answer", answerSchema);
module.exports = Answer;