const ExpressError = require('./utils/ExpressError.js');
const {userSchema} = require('./schemas.js');
const {reviewSchema} = require('./schemas.js');
const Review = require("./models/review.js");
module.exports = {
    isLoggedIn: (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl;
            req.flash('error', "You must be logged in!!");
            return res.redirect('/login');
        }
        next();
    },

    storeReturnTo: (req, res, next) => {
        if (req.session.returnTo) {
            res.locals.returnTo = req.session.returnTo;
        }
        next();
    },

    validateUser : (req, res, next) => {
        const {error} = userSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el=>el.message).join(',');
            throw new ExpressError(msg, 400);
        }
        else{
            next();
        }
    },

    validateReview : (req, res, next) => {
        const {error} = reviewSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el=>el.message).join(',');
            throw new ExpressError(msg, 400);
        }
        else{
            next();
        }
    },

    isReviewAuthor : async (req, res, next) => {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review.author || !review.author.equals(req.user._id)) {
            req.flash('error', "You do not have the permission to do that!!");
            return res.redirect(`/users/${id}`);
        }
        next();
    }
};

