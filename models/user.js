const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;