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

const users = require("./routes/users.js");
const reviews = require("./routes/review.js");

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users',users);
app.use('/users/:id/reviews',reviews);

// Home Route
app.get("/", (req, res) => {
    res.render("home");
});


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
