import { useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { validSchema } from "./AuthFormValidator";
import { encryptData } from "../../utils/secure";
import { sendDataToServer } from "../../utils/api";
import "./AuthForm.css";

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
  const [isLogin, setIsLogin] = useState(false); // false = Register

  const handleSubmit = async (values, { resetForm }) => {
    
      // Send data to server
      const loginOrRegister = isLogin ? "Login" : "Register";
      console.log(`Login or Register: ${loginOrRegister}`);
      if (isLogin) {
        
      } else {
        const { username, email, password, phoneNumber } = values;

        //Username encrypted
        const encryptedUsername = encryptData(username);

        //Email encrypted
        const encryptedEmail = encryptData(email);

        //Password encrypted
        const encryptedPassword = encryptData(password);

        //Phone number encrypted
        const encryptedPhoneNumber = encryptData(phoneNumber);

        const userData = {
          username: encryptedUsername,
          email: encryptedEmail,
          password: encryptedPassword,
          phoneNumber: encryptedPhoneNumber,
        };

        try {

        await sendDataToServer(endpoint, userData);
        alert(`${isLogin ? "Login" : "Registration"} successful!`);

        resetForm();
        onClose();
      }catch (error) {
      alert(
        `This Error come from sending data to server function: ${error.message}`
      );
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
          onSubmit={handleSubmit}
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
}};

export default AuthForm;
