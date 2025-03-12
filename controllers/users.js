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
        newUser.profileImageURL = req.files.map(f => ({url: f.path, filename: f.filename}));
        newUser.author = req.user._id;
        await newUser.save();
        // console.log(newUser);
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
        // console.log(user);
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

    // updateUsers: async (req, res) => {
    //     const { id } = req.params;
    //     const { user } = req.body;
    //     console.log(user);
    //     const user1 = await User.findById(id);
    //     if (!user1.author || !user1.author.equals(req.user._id)) {
    //         req.flash('error', "You do not have the permission to do that!!");
    //         return res.redirect(`/users/${id}`);
    //     }
    //     const newuser = await User.findByIdAndUpdate(id, { ...user });
    //     const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    //     newuser.profileImageURL.push(...imgs);
    //     await newuser.save();
    //     req.flash('success', "Successfully updated the user!!");
    //     res.redirect(`/users/${id}`);
    // },
    updateUsers: async (req, res) => {
        const { id } = req.params;
        let { user } = req.body;
        console.log(user);
    
        // Convert hobbies field from string to array.
        // If your input is a comma-separated string of hobbies:
        if (user.hobbies && typeof user.hobbies === 'string') {
            user.hobbies = user.hobbies.split(',').map(hobby => hobby.trim());
        }
        // Otherwise, if you expect just one hobby, you can do:
        // user.hobbies = [user.hobbies];
    
        const user1 = await User.findById(id);
        if (!user1.author || !user1.author.equals(req.user._id)) {
            req.flash('error', "You do not have the permission to do that!!");
            return res.redirect(`/users/${id}`);
        }
        
        // Update non-file fields and return the updated document
        const updatedUser = await User.findByIdAndUpdate(id, { ...user }, { new: true });
        
        // Only process image uploads if files are present
        if (req.files && req.files.length > 0) {
            const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
            updatedUser.profileImageURL.push(...imgs);
            await updatedUser.save();
        }
        
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