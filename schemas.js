const Joi = require("joi");

module.exports.userSchema = Joi.object({
    user: Joi.object({
        fullName: Joi.string().required(),
        location: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        profileImageURL: Joi.string(), 
        hobbies: Joi.string().required(),
        description: Joi.string().required(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
    }).required()
});