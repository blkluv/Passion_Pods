const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
require("dotenv").config();
const User = require("./models/user.js");
const methodOverride = require("method-override");

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
app.get("/users", async (req, res) => {
    const users = await User.find({});
    res.render("users/index", { users });
});

// New User Form Route
app.get("/users/new", (req, res) => {
    res.render("users/new");
});

// Create New User
app.post("/users", async (req, res) => {
    const user = new User(req.body.user);
    await user.save();
    res.redirect(`/users/${user._id}`); // Redirect correctly
});

// Show User Route
app.get("/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.render("users/show", { user });
});

// Edit User Form Route
app.get("/users/:id/edit", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.render("users/edit", { user });
});

// Update User
app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body.user });
    res.redirect(`/users/${id}`); // Use `/users/${id}` directly
});

// Delete User
app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect("/users");
});

app.listen(5000, () => {
    console.log("Serving on PORT 5000!");
});
