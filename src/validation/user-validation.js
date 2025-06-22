import Joi from "joi";

const register = Joi.object({
  username: Joi.string().min(6).max(24).required().trim(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(24).required(),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Confirm password must match password" }),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(24).required(),
});

const get = Joi.string().email().required();
export default {
  register,
  login,
  get,
};
