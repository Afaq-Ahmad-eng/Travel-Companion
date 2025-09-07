//External modules

//Yup is library which we use for the validation
import * as yup from 'yup';

//Regular expression to prevent user to put only valid entries
const RegExpressionForAuthFormValidation = /^[\p{L}][\p{L} \-']*[\p{L}]$/u;
export const validSchema = yup.object({
  username:  yup.string()
            .required("Name is required")
            .min(3, "Name must be at least 3 characters")
            .matches(RegExpressionForAuthFormValidation, 'Name must only contain letters, spaces, hyphens, or apostrophes')
            .test(
              "name",
              "Name must contain only valid English words (case-insensitive), e.g., 'John Doe' or 'Alice Smith'",
              (value) => {
                if (!value) return false;
                const words = value.split(" ");
                return words.every((word) => /^[A-Za-z]+$/.test(word));
              }
            ),

  email: yup.string()
            .required("Email is required")
            .email("Invalid email format"),
 password: yup.string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)")
            .matches(RegExpressionForAuthFormValidation, 'Password must start with a letter and contain only letters, numbers, and spaces'),

})