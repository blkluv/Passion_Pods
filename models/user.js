const mongoose = require("mongoose");
const Review = require("./review");
const Profile = require('./profile');
const { Schema, model } = mongoose; 

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    profileImageURL: [
        {
            url: String, 
            filename: String,
        }
    ],
    hobbies: {
        type: [String], 
        default: [],    
    },
    description: {
        type: String,
    },
    author : {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ]
}, { timestamps: true });

userSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        });
    }
});

const User = model("User", userSchema); 

module.exports = User;
