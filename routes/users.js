const express = require("express");
const Router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const {isLoggedIn, validateUser} = require('../middleware.js');
const users = require('../controllers/users.js');

// Users Index Route
Router.get("/", catchAsync(users.index));

// New User Form Route
Router.get("/new", isLoggedIn, users.renderNewForm);

// Create New User
Router.post("/", isLoggedIn, validateUser, catchAsync(users.createUser));

// Show User Route
Router.get("/:id", catchAsync(users.showUsers));

// Edit User Form Route
Router.get("/:id/edit", isLoggedIn, catchAsync(users.renderEditForm));

// Update User
Router.put("/:id", validateUser, catchAsync(users.updateUsers));

// Delete User
Router.delete("/:id", catchAsync(users.deleteUsers));

module.exports = Router;