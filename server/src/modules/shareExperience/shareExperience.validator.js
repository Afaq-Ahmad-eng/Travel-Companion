import Joi from "joi";

const countWords = (str) => str.trim().split(/\s+/).length;
const titleDescriptionRegex = /^(?!.*\d)[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

export const shareExperienceSchema = Joi.object({
  title: Joi.string().required().pattern(titleDescriptionRegex),
  description: Joi.string().required().custom((value, helpers) => {
    const wordCount = countWords(value);
    if (wordCount < 10) return helpers.error("string.min");
    if (wordCount > 100) return helpers.error("string.max");
    if (!titleDescriptionRegex.test(value)) return helpers.error("string.pattern.base");
    return value;
  }), blog: Joi.string().allow("").optional(),
  images: Joi.array()
    .min(1)
    .max(20)
    .items(
      Joi.object({
        mimetype: Joi.string().valid(
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/gif"
        ),
      }).unknown(true)
    )
    .required(),
  rating: Joi.number().min(1).max(5).required(),
});
