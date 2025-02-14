const express = require("express");
const Router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const User = require("../models/user.js");
const Review = require("../models/review.js");
const {reviewSchema} = require('../schemas.js');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

Router.post("/", validateReview, catchAsync(async (req,res) => {
    const user = await User.findById(req.params.id);
    const review = new Review(req.body.review);
    user.reviews.push(review);
    await review.save();
    await user.save();
    req.flash('success', "Created your review!!");
    res.redirect(`/users/${user._id}`);
}))

Router.delete("/:reviewId", catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await User.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Deleted your review!!");
    res.redirect(`/users/${id}`);
}));

module.exports = Router;