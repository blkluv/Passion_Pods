const Review = require("../models/review");
const User = require("../models/user.js");

module.exports = {
    createReview: async (req,res) => {
        const user = await User.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        user.reviews.push(review);
        await review.save();
        await user.save();
        req.flash('success', "Created your review!!");
        res.redirect(`/users/${user._id}`);
    },

    deleteReview: async (req, res) => {
        const {id, reviewId} = req.params;
        await User.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', "Deleted your review!!");
        res.redirect(`/users/${id}`);
    },
};