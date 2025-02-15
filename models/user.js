const mongoose = require("mongoose");
const Review = require("./review");
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
    profileImageURL: {
        type: String,
    },
    hobbies: {
        type: [String], 
        default: [],    
    },
    description: {
        type: String,
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
