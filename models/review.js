const mongoose = require("mongoose");
const { Schema, model } = mongoose; 

const reviewSchema = new Schema({
    body: {
        type: String,
    },
    rating:{
        type: Number,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
    },
}, { timestamps: true });

const Review = model("Review", reviewSchema); 

module.exports = Review;

