const mongoose = require("mongoose");
const { Schema, model } = mongoose; 

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    profileImageURL: {
        type: String,
    },
    hobbies: {
        type: [String], 
        default: [],    
    },
}, { timestamps: true });

const User = model("User", userSchema); 

module.exports = User;
