import Joi from "joi";
import { AppError } from "../../utils/AppError.js";
import { use } from "react";

/**
 * Joi validation for admin routes
 *
 * Exports:
 *  - validateUpdateUser  : middleware to validate req.body for PUT /admin/users/:id
 *  - validateListUsers   : middleware to validate req.query for GET /admin/users
 */

/* Allowed roles/statuses — adjust to your app's values if different */
const ALLOWED_STATUS = ["active", "pending"];

/* Phone pattern: allow digits, spaces, + - ( ) between 6 and 20 chars */
const phonePattern = /^[0-9+\-\s()]{6,20}$/;

const updateUserSchema = Joi.object({
  user_name: Joi.string().trim().min(2).messages({
    "string.min": "Name must be at least 2 characters",
  }),
  user_email: Joi.string().trim().email().messages({
    "string.email": "Provide a valid email address",
  }),
  user_status: Joi.string().valid(...ALLOWED_STATUS).messages({
    "any.only": `Status must be one of: ${ALLOWED_STATUS.join(", ")}`,
  }),
  user_phoneno: Joi.string().allow("", null).pattern(phonePattern).messages({
    "string.pattern.base": "Phone number contains invalid characters",
  }),
  user_location: Joi.string().trim().allow("", null).max(255).messages({ "string.max": "Location is too long" })
  //Password validator will be declare 
})
  .min(1) // require at least one field to update
  .messages({
    "object.min": "At least one updatable field must be provided",
  });

export const validateUpdateUser = (req, res, next) => {
  const { error, value } = updateUserSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, errors });
  }

  req.body = value;
  return next();
};

/* Validation for listing users (query params) */
const listUsersSchema = Joi.object({
  q: Joi.string().trim().allow("", null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(200).default(50),
});

export const validateListUsers = (req, res, next) => {
  const { error, value } = listUsersSchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, errors });
  }

  req.query = value;
  return next();
};

//admin register validator
const adminRegisterSchema = Joi.object({
  username: Joi.string().trim().min(2).required().messages({
    "string.min": "Name must be at least 2 characters",
    "any.required": "Name is required",
  }),
  location: Joi.string().trim().max(255).required().messages({
    "string.max": "Location is too long",
    "any.required": "Location is required",
  }),
  phoneno: Joi.string().trim().pattern(phonePattern).required().messages({
    "string.pattern.base": "Phone number contains invalid characters",
    "any.required": "Phone number is required",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.email": "Provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().trim().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

export const validateAdminRegister = (adminRegisterData) => {
  console.log("We are at the validator for the Register ", adminRegisterData);
  return adminRegisterSchema.validate(adminRegisterData);
};

//admin login validator
const adminLoginSchema = Joi.object({ 
  user_email: Joi.string().trim().email().required().messages({
    "string.email": "Provide a valid email address",
    "any.required": "Email is required",
  }),
  user_password: Joi.string().trim().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

export const validateAdminLogin = (adminLoginData) => {
  return adminLoginSchema.validate(adminLoginData);
  };


export default {
  validateUpdateUser,
  validateListUsers,
  validateAdminRegister
};