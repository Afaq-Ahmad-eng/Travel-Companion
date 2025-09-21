// External modules
import words from "word-list-json";
//Yup is library which we use for the validation
import * as yup from "yup";

//library for names in any languages
import XRegExp from "xregexp";

//Regular Expression for title input field
const RegExpForValidation = XRegExp(
  "^(?!.*\\d)[\\p{L}]+(?:[ '-][\\p{L}]+)*$",
  "u"
);

// Convert this store file to Set for faster lookup

const wordSet = new Set(words);

// Debouncing function for optimization
// function debounce(callback,delay){
//     let timeout;
//     return function(...argus){
//         return new Promise((res,rej) => {
//            clearTimeout(timeout);
//            timeout = setTimeout(() => {
//             callback(...argus)
//             .then(res)
//             .catch(rej)
//            },delay)
//         });
//     };
// }

//function which check that the words which user provide is exist in real-world or not
function isEnglishWords(sentence) {
  if (!sentence) return false;

  // Split words and normalize
  const wordsArr = sentence
    .split(/\s+/)
    .map((w) => w.toLowerCase().replace(/[^a-z']/g, ""));

  // If ANY word is not in dictionary → invalid
  for (let word of wordsArr) {
    if (word && !wordSet.has(word)) {
      return false;
    }
  }
  return true;
}

export const validSchema = yup.object({
  title: yup
    .string()
    .required("You must provide a Title!")
    .matches(RegExpForValidation, "Enter A Valid Title")
    .test(
      "title",
      "Title must use valid English words (e.g., 'Trip with Friends').",
    (val) => {
          return isEnglishWords(val);
        }
    ),
  description: yup
    .string()
    .required("Description field is required.")
    .matches(
      RegExpForValidation,
      "Invalid input: only letters allowed; no numbers or symbols."
    )
    .test("description", "Invalid Description", function (description) {
      const wordsCount = description.trim().split(/\s+/).length;
      if (wordsCount < 10) {
        console.log(`word count is ${wordsCount}`);
        return this.createError({
          message: `Too short. Minimum 10 words (currently ${wordsCount} words)`,
        });
      }
      if (wordsCount > 100) {
        return this.createError({
          message: `Too long. Maximum 100 words. (currently ${wordsCount} words)`,
        });
      }
        return true;
    })
    .test("description", "Description must contain valid English words.", (val) => {
      return isEnglishWords(val);
    }),
  images: yup
    .array()
    .min(1, "At least 1 image is required")
    .max(20, "No more than 20 images allowed")
    .required("Images are required")
    .test(
      "fileType",
      "Only image files are allowed",
      (files) =>
        files &&
        files.every((file) =>
          ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
            file.type
          )
        )
    ),
  rating: yup
    .number()
    .nullable()
    .required("Rating is required to help us improve our services!")
});
