const Joi = require('joi');

// User validation
const registerValidation = data => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

const loginValidation = data => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  });
  return schema.validate(data);
};

// Post validation
const postValidation = data => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(10).required(),
    tags: Joi.array().items(Joi.string().min(2).max(20))
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  postValidation
};