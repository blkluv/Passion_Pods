const express = require("express");
const Router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync.js');
const User = require("../models/user.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');

Router.post("/",isLoggedIn, validateReview, catchAsync(async (req,res) => {
    const user = await User.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    user.reviews.push(review);
    await review.save();
    await user.save();
    req.flash('success', "Created your review!!");
    res.redirect(`/users/${user._id}`);
}))

Router.delete("/:reviewId",isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await User.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Deleted your review!!");
    res.redirect(`/users/${id}`);
}));

module.exports = Router;