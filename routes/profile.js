const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const passport = require('passport');
const {storeReturnTo} = require('../middleware.js');
const profile = require('../controllers/profile.js');

router.get('/register', profile.renderRegisterForm);

router.post('/register', catchAsync(profile.userRegistration));

router.get('/login', profile.renderLoginForm);

router.post('/login',storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), profile.userLogin);

router.get('/logout', profile.userLogout); 

module.exports = router;