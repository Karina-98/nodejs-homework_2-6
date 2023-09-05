const Joi = require("joi");


const registerUserSchema = Joi.object({
    password: Joi.string().required().min(6),
     email: Joi.string().required(),
    subscription: Joi.string().required().valid("starter", "pro", "business"),
})

const emailSchema = Joi.object({
    email: Joi.string().required(),
})

const loginUserSchema = Joi.object({
    password: Joi.string().required().min(6),
    email: Joi.string().required(),
});

module.exports = {registerUserSchema, loginUserSchema, emailSchema}
