const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
require('dotenv').config();
const User = require("./models/user.js");
const methodOverride = require("method-override");

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected!"));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/users", async (req, res) => {
    const users = await User.find({});
    res.render('users/index', { users });
});

app.get('/users/new', (req, res) => {
    res.render('users/new');
});

app.post("/users", async (req, res) => {
    const user = new User(req.body.user);
    await user.save();
    res.redirect(`/users/${user._id}`); // Redirect correctly
});

app.get("/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('users/show', { user });
});

app.get('/users/:id/edit', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('users/edit', { user });
});

app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body.user });
    res.redirect(`/users/${user._id}`); // Fix redirection to ensure only one `/users/` is present
});

app.listen(5000, () => {
    console.log("Serving on PORT 5000!");
});
