const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require('./utils/ExpressError.js');
require("dotenv").config();
const methodOverride = require("method-override");

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

const sessionConfig = {
    secret: 'Hello, @ PassionPods',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success') || "";
    res.locals.error = req.flash('error') || "";
    next();
});

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
