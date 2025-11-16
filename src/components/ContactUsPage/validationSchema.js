import * as Yup from "yup";
import { isEnglishWords } from "../ShareYourExperience/ExperienceFormValidator";
import { RegExpForValidation } from "../ShareYourExperience/ExperienceFormValidator";

export const contactValidationSchema = Yup.object({
//   name: Yup.string()
//     .min(2, "Name is too short")
//     .required("Name is required"),

//   email: Yup.string()
//     .email("Invalid email format")
//     .required("Email is required"),

  subject: Yup.string()
    .min(3, "Subject must be at least 3 characters")
    .required("Subject is required")
    .matches(
        RegExpForValidation,
         "Subject must contain only letters (no numbers or special characters)."
    )
    .test(
        "subject",
        "Subject must contain valid English words only.",
        (value)=>{
            return isEnglishWords(value.trim())
        }
    ),

  category: Yup.string().required("Please select a category"),

  message: Yup.string()
    .required("Message is required")
    .matches(
    RegExpForValidation,
    "Message must contain only letters, spaces, apostrophes, or hyphens (no numbers or symbols)."
  )
   .test(
    "english-words",
    "Message must contain valid English words only.",
    (val) => {
      if (!val) return false;
      return isEnglishWords(val.trim());
    }
  )
  .test(
    "word-count",
    "Message must be between 12 and 100 words.",
    (val) => {
      if (!val) return false;

      // Count words (split by spaces and filter out empty strings)
      const wordCount = val.trim().split(/\s+/).filter(Boolean).length;

      return wordCount >= 12 && wordCount <= 100;
    }
  ),

  attachment: Yup.mixed()
  .nullable()
  .required("Kindly share at least one picture so we can better understand and resolve your issue.")
  .test(
    "fileSize",
    "File is too large (max 2MB).",
    (file) => {
      // handle both single and array file cases
      const selectedFile = Array.isArray(file) ? file[0] : file;
      if (!selectedFile) return false; // no file => fail
      return selectedFile.size <= 2 * 1024 * 1024;
    }
  )
  .test(
    "fileType",
    "Unsupported file format. Allowed: JPG, PNG, or PDF.",
    (file) => {
      const selectedFile = Array.isArray(file) ? file[0] : file;
      if (!selectedFile) return false;
      return ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(selectedFile.type);
    }
  ),
});
