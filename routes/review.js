const express = require("express");
const Router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const reviews = require("../controllers/reviews.js");

Router.post("/",isLoggedIn, validateReview, catchAsync(reviews.createReview))

Router.delete("/:reviewId",isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = Router;