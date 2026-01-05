import * as Yup from "yup";

export const adminSettingsValidation = Yup.object({
  adminName: Yup.string().required("Admin name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  location: Yup.string().required("Location is required"),
  password: Yup.string().required("Password is required"),
});
