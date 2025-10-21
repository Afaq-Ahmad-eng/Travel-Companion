import Joi from "joi";

export const tripSchema = Joi.object({
  trip_title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "trip_title is required and must be at least 3 characters.",
      "string.min": "trip_title must be at least 3 characters long.",
      "any.required": "trip_title is required.",
    }),

  destination: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "destination is required.",
      "any.required": "destination is required.",
    }),

  interest_areas: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().trim()).min(1).messages({
        "array.min": "Select at least one interest area.",
      }),
      Joi.string().trim().pattern(/.+/).messages({
        "string.pattern.base": "Select at least one interest area.",
      })
    )
    .required()
    .messages({
      "any.required": "Select at least one interest area.",
    }),

  start_date: Joi.date()
    .required()
    .messages({
      "date.base": "Valid start_date is required.",
      "any.required": "start_date is required.",
    }),

  end_date: Joi.date()
    .required()
    .greater(Joi.ref("start_date"))
    .messages({
      "date.base": "Valid end_date is required.",
      "any.required": "end_date is required.",
      "date.greater": "start_date must be before end_date.",
    }),
});
