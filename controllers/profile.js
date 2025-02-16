const Profile = require("../models/profile");

module.exports = {
    renderRegisterForm: (req,res) => {
        res.render('profile/register');
    },

    userRegistration: async (req,res, next) => {
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
    },

    renderLoginForm: (req, res) => {
        res.render('profile/login');
    },

    userLogin: (req, res) => {
        req.flash('success', 'Welcome Back!');
        const redirectUrl = res.locals.returnTo || '/users';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    },

    userLogout: (req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Goodbye!');
            res.redirect('/users');
        });
    },

};