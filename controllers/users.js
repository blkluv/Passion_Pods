const User = require("../models/user.js");

module.exports = {
    index : async (req, res) => {
        const users = await User.find({});
        res.render("users/index", { users });
    },

    renderNewForm : (req, res) => {
        res.render("users/new");
    },

    createUser: async (req, res, next) => {
        const { user } = req.body;
        // if (user.profileImageURL && user.profileImageURL.trim() !== "" && !isValidUrl(user.profileImageURL)) {
        //     throw new ExpressError("Invalid image URL provided", 400);
        // }
        const newUser = new User(user);
        newUser.author = req.user._id;
        await newUser.save();
        req.flash('success', "Successfully added a new user!!");
        res.redirect(`/users/${newUser._id}`);
    },

    showUsers: async (req, res) => {
        const user = await User.findById(req.params.id).populate({path: 'reviews', populate: {path: 'author'}}).populate('author');
        if (!user) {
            req.flash('error', "Cannot find the user!!");
            return res.redirect('/users');
        }
        res.render("users/show", { user });
    },

    renderEditForm: async (req, res) => {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            req.flash('error', "Cannot find the user!!");
            return res.redirect('/users');
        }
        if (!user.author || !user.author.equals(req.user._id)) {
            req.flash('error', "You do not have the permission to do that!!");
            return res.redirect(`/users/${id}`);
        }
        res.render("users/edit", { user });
    },

    updateUsers: async (req, res) => {
        const { id } = req.params;
        const { user } = req.body;
        const user1 = await User.findById(id);
        if (!user1.author || !user1.author.equals(req.user._id)) {
            req.flash('error', "You do not have the permission to do that!!");
            return res.redirect(`/users/${id}`);
        }
        await User.findByIdAndUpdate(id, { ...user });
        req.flash('success', "Successfully updated the user!!");
        res.redirect(`/users/${id}`);
    },

    deleteUsers: async (req, res) => {
        const { id } = req.params;
        const user1 = await User.findById(id);
        if (!user1.author || !user1.author.equals(req.user._id)) {
            req.flash('error', "You do not have the permission to do that!!");
            return res.redirect(`/users/${id}`);
        }
        await User.findByIdAndDelete(id);
        req.flash('success', "Aww, we deleted the user!!");
        res.redirect("/users");
    },
};