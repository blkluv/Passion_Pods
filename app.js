const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const catchAsync = require('./utils/catchAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const Joi = require('joi');
const Review = require("./models/review.js");
require("dotenv").config();
const User = require("./models/user.js");
const methodOverride = require("method-override");
const {userSchema, reviewSchema} = require('./schemas.js');
const {isValidUrl} = require("./utils/helper.js");
const validateUser = (req, res, next) => {
    const {error} = userSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}
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
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Home Route
app.get("/", (req, res) => {
    res.render("home");
});

// Users Index Route
app.get("/users", catchAsync(async (req, res) => {
    const users = await User.find({});
    res.render("users/index", { users });
}));

// New User Form Route
app.get("/users/new", (req, res) => {
    res.render("users/new");
});

// Create New User
app.post("/users", validateUser, catchAsync(async (req, res, next) => {
    const { user } = req.body;
    if (user.profileImageURL && !isValidUrl(user.profileImageURL)) {
        throw new ExpressError("Invalid image URL provided", 400);
    }
    const newUser = new User(user);
    await newUser.save();
    res.redirect(`/users/${newUser._id}`);
}));


// Show User Route
app.get("/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.render("users/show", { user });
});

// Edit User Form Route
app.get("/users/:id/edit", catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.render("users/edit", { user });
}));

// Update User
app.put("/users/:id", validateUser, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    if (user.profileImageURL && !isValidUrl(user.profileImageURL)) {
        throw new ExpressError("Invalid image URL provided", 400);
    }
    await User.findByIdAndUpdate(id, { ...user });
    res.redirect(`/users/${id}`);
}));


// Delete User
app.delete("/users/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect("/users");
}));

app.post("/users/:id/reviews", validateReview, catchAsync(async (req,res) => {
    const user = await User.findById(req.params.id);
    const review = new Review(req.body.review);
    user.reviews.push(review);
    await review.save();
    await user.save();
    res.redirect(`/users/${user._id}`);
}))
app.all('*', (req,res,next)=>{
    next(new ExpressError("Page Not Found!", 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message} = err;
    if(!err.message)err.message = "Oh No!! Something Went Wrong!";
    res.status(statusCode).render('error', {err}); 
})

app.listen(5000, () => {
    console.log("Serving on PORT 5000!");
});
