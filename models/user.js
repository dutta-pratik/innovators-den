const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name:{
        type: String
    },
    second_name:{
        type: String
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String
    },
    confirm_mail_code:{
        type: String
    },
    confirm_mail_status:{
        type: Boolean,
        default: false
    },
    reset_code:{
        type: Number,
        expires: 1*60*1000
    },
    my_preference:[{
        type: String
    }],
    question_recieved:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    post:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post"  
    }]
});

const User = mongoose.model("User", userSchema);
module.exports = User;