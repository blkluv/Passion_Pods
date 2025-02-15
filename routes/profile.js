const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const Profile = require("../models/profile");
const passport = require('passport');
const {storeReturnTo} = require('../middleware.js');

router.get('/register', (req,res) => {
    res.render('profile/register');
});

router.post('/register', catchAsync(async (req,res, next) => {
    try{
        const {email, username, password} = req.body;
        const user = new Profile({email, username});
        const newUser = await Profile.register(user, password);
        req.login(newUser, err => {
            if(err) return next(err);
            req.flash('success', "Welcome to Passion-Pods!!");
            res.redirect('/users');
        })
    } catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('profile/login');
});

router.post('/login',storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/users';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/users');
    });
}); 

module.exports = router;