import Joi from "joi";

/**
 * Joi validation for admin routes
 *
 * Exports:
 *  - validateUpdateUser  : middleware to validate req.body for PUT /admin/users/:id
 *  - validateListUsers   : middleware to validate req.query for GET /admin/users
 */

/* Allowed roles/statuses — adjust to your app's values if different */
const ALLOWED_ROLES = ["user", "moderator", "admin"];
const ALLOWED_STATUS = ["active", "suspended", "pending"];

/* Phone pattern: allow digits, spaces, + - ( ) between 6 and 20 chars */
const phonePattern = /^[0-9+\-\s()]{6,20}$/;

const updateUserSchema = Joi.object({
  user_name: Joi.string().trim().min(2).messages({
    "string.min": "Name must be at least 2 characters",
  }),
  user_email: Joi.string().trim().email().messages({
    "string.email": "Provide a valid email address",
  }),
  user_role: Joi.string().valid(...ALLOWED_ROLES).messages({
    "any.only": `Role must be one of: ${ALLOWED_ROLES.join(", ")}`,
  }),
  user_status: Joi.string().valid(...ALLOWED_STATUS).messages({
    "any.only": `Status must be one of: ${ALLOWED_STATUS.join(", ")}`,
  }),
  user_phoneno: Joi.string().allow("", null).pattern(phonePattern).messages({
    "string.pattern.base": "Phone number contains invalid characters",
  }),
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

export default {
  validateUpdateUser,
  validateListUsers,
};