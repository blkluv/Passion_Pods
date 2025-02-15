const express = require("express");
const Router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const User = require("../models/user.js");
const {userSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware.js');

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

// Users Index Route
Router.get("/", catchAsync(async (req, res) => {
    const users = await User.find({});
    res.render("users/index", { users });
}));

// New User Form Route
Router.get("/new", isLoggedIn, (req, res) => {
    res.render("users/new");
});

// Create New User
Router.post("/", isLoggedIn, validateUser, catchAsync(async (req, res, next) => {
    const { user } = req.body;
    // if (user.profileImageURL && user.profileImageURL.trim() !== "" && !isValidUrl(user.profileImageURL)) {
    //     throw new ExpressError("Invalid image URL provided", 400);
    // }
    const newUser = new User(user);
    await newUser.save();
    req.flash('success', "Successfully added a new user!!");
    res.redirect(`/users/${newUser._id}`);
}));


// Show User Route
Router.get("/:id", catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id).populate('reviews');
    if (!user) {
        req.flash('error', "Cannot find the user!!");
        return res.redirect('/users');
    }
    res.render("users/show", { user });
}));

// Edit User Form Route
Router.get("/:id/edit", catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        req.flash('error', "Cannot find the user!!");
        return res.redirect('/users');
    }
    res.render("users/edit", { user });
}));

// Update User
Router.put("/:id", validateUser, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    if (user.profileImageURL && !isValidUrl(user.profileImageURL)) {
        throw new ExpressError("Invalid image URL provided", 400);
    }
    await User.findByIdAndUpdate(id, { ...user });
    req.flash('success', "Successfully updated the user!!");
    res.redirect(`/users/${id}`);
}));


// Delete User
Router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    req.flash('success', "Aww, we deleted the user!!");
    res.redirect("/users");
}));

module.exports = Router;