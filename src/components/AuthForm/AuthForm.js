import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import { validSchema } from "./AuthFormValidator";
import { encryptData } from "../../utils/secure";
import { sendDataToServer } from "../../utils/api";
import "./AuthForm.css";
import Swal from "sweetalert2";

//endpoint URLs

const endpoint = "http://localhost:3001/auth/register"; // Registration endpoint

// Initial values for Formik
const initialValues = {
  username: "",
  email: "",
  password: "",
  phoneNumber: "",
};
const AuthForm = ({ onClose }) => {
  // const naivgator = useNavigate();
  const [isLogin, setIsLogin] = useState(false); // false = Register

  const onSubmitForm = async (values, { resetForm }) => {
    // Send data to server
    if (isLogin) {
    } else {
      const { username, email, password, phoneNumber } = values;

      //Encrypt the Data
      const userData = {
        username: encryptData(username),
        email: encryptData(email),
        password: encryptData(password),
        phoneNumber: encryptData(phoneNumber),
      };
      try {
        const response = await sendDataToServer(endpoint, userData);
        console.log("We are at frontend AuthForm",response);
        
        const MsgForSuccessfulCompletion = `${isLogin ? "Login" : "Registration"} successful!`;

          Swal.fire({
            title: `User ${MsgForSuccessfulCompletion}`,
            text: `Dear ${response.data.response.username} ${response.data.message}`,
            icon: "success",
            timer: 3000,
            showConfirmButton: true,
          });
        resetForm();
        onClose();
      } catch (error) {
        onClose();
        Swal.fire({
          title: `${isLogin ? "Login" : "Registration"} is Failed`,
          text:  error.response.data.message,
          icon: "error",
          confirmButtonText: "Click here to continue",
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>
          ×
        </button>
        <Formik
          //We are passing initialValues to the Formik component
          initialValues={initialValues}
          //We are passing isLogin to the validSchema function to get the correct schema
          validationSchema={validSchema(isLogin)}
          //We are enabling validation on change and blur events
          validateOnChange={true}
          // We are enabling validation on blur events
          validateOnBlur={true}
          //We are passing handleSubmit function to the onSubmit prop
          onSubmit={onSubmitForm}
        >
          {({ handleSubmit, handleChange, setFieldTouched }) => (
            <form onSubmit={handleSubmit} className="auth-form">
              <h2>{isLogin ? "Login" : "Register"}</h2>

              {!isLogin && (
                <>
                  <Field
                    name="username"
                    type="text"
                    placeholder="Enter your full name"
                    className="auth-input"
                    onChange={(e) => {
                      handleChange(e);
                      setFieldTouched("username", true, false);
                    }}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error"
                  />
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="auth-input"
                    onChange={(e) => {
                      handleChange(e);
                      setFieldTouched("email", true, false);
                    }}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                  />
                  <Field
                    name="phoneNumber"
                    type="text"
                    placeholder="Phone Number  (e.g., +929876543210)"
                    className="auth-input"
                    onChange={(e) => {
                      handleChange(e);
                      setFieldTouched("phoneNumber", true, false);
                    }}
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="error"
                  />
                </>
              )}

              {isLogin && (
                <>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="auth-input"
                    onChange={(e) => {
                      handleChange(e);
                      setFieldTouched("email", true, false);
                    }}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                  />
                </>
              )}
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="auth-input"
                onChange={(e) => {
                  handleChange(e);
                  setFieldTouched("password", true, false);
                }}
              />
              <ErrorMessage name="password" component="div" className="error" />

              <button type="submit" className="auth-btn">
                {isLogin ? "Login" : "Register"}
              </button>

              <p className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
                {isLogin
                  ? "Don't have an account? Register"
                  : "Already have an account? Login"}
              </p>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AuthForm;
