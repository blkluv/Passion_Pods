const Joi = require("joi");

module.exports.userSchema = Joi.object({
    user: Joi.object({
        fullName: Joi.string().required(),
        location: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        profileImageURL: Joi.string().uri().allow(""), 
        hobbies: Joi.string().required(),
        description: Joi.string().required(),
    }).required()
});
