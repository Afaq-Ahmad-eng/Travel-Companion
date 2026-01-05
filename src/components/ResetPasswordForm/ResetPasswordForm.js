import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import styles from "./ResetPasswordForm.module.css";
import { sendDataToServer } from "../../utils/api";

const ResetPassword = ({ onClose }) => {
  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&_]/,
        "Password must contain at least one special character (@, $, !, %, *, ?, &)"
      ),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const domainPart = values.email.split("@")[1] || "";
      const isAdmin =
        domainPart.startsWith("s") ||
        domainPart.includes("smarttravelcompanion.com");

      if (isAdmin) {
        onClose();
        Swal.fire({
          position: "center-start",
          icon: "error",
          title: "Access Denied",
          timer:1500,
          timerProgressBar:true,
          text: "Admin password changes are only allowed in the Admin Dashboard.",
        }).then(()=>{
          setSubmitting(false);
          onClose();
        });
        return;
      }
      // authFormHide();
      const response = await sendDataToServer(
        "http://localhost:3001/auth/forget-passwrod",
        { password: values.password, email: values.email }
      );

      onClose();
      Swal.fire({
        icon: "success",
        title: response.message || "Password Updated!",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        position: "bottom-right",
        toast: true,
      }).then(() => {
        resetForm();
      });
    } catch {
      onClose();
      Swal.fire({
        position: "bottom-right",
        icon: "error",
        title: "Error",
        text: "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.authOverlay}>
      <div className={styles.authModal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>Reset Password</h2>

        <Formik
          initialValues={{ password: "", confirmPassword: "", email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, handleChange, setFieldTouched }) => (
            <Form className={styles.form}>
              <Field
                type="email"
                name="email"
                placeholder="Enter the email"
                className={styles.inputField}
                onChange={(e) => {
                  handleChange(e);
                  setFieldTouched("email", true, false);
                }}
              />
              <ErrorMessage
                name="email"
                component="div"
                className={styles.error}
              />
              <Field
                type="password"
                name="password"
                placeholder="New Password"
                className={styles.inputField}
                onChange={(e) => {
                  handleChange(e);
                  setFieldTouched("password", true, false);
                }}
              />
              <ErrorMessage
                name="password"
                component="div"
                className={styles.error}
              />

              <Field
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={styles.inputField}
                onChange={(e) => {
                  handleChange(e);
                  setFieldTouched("confirmPassword", true, false);
                }}
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className={styles.error}
              />

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
