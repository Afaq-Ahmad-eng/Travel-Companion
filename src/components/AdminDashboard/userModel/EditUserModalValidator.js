import * as yup from "yup";

// Validation schema for editing user
export const editSchema = yup.object({
  user_name: yup.string().required("Name is required").min(2),
  user_email: yup.string().required("Email is required").email("Invalid email"),
  user_location: yup.string().required("User Location is provide"),
  user_status: yup.string().required("Status is required"),
  user_phoneno: yup
            .string()
            .required("Phone Number is required")
            .matches(/^\+/, "Phone number must start with '+' and country code")
  
            // Must only contain digits after +
            .matches(/^\+\d+$/, "Phone number must contain only digits after '+'")
  
            // Length between 10 and 15 digits total
            .matches(/^\+\d{10,15}$/, "Phone number must be between 10–15 digits")
            .min(
              13,
              "Phone Number must be at least 13 digits long including country code"
            )
            .max(
              13,
              "Phone Number must be at most 13 digits long including country code"
            ),
});