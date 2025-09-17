// auth.validator.js
import Joi from "joi";

export const validateRegister = (data) => {
   const schema = Joi.object({
    user_name: Joi.string().min(3).required(),
    user_email: Joi.string().email().required(),
    user_phoneno: Joi.string().min(13).required(),
    user_password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};
