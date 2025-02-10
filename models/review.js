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
}, { timestamps: true });

const Review = model("Review", reviewSchema); 

module.exports = Review;

