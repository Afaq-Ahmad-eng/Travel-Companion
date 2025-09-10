import { useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { validSchema } from "./AuthFormValidator";
import CryptoJS from "crypto-js";

import "./AuthForm.css";

//Secret key for AES encryption
const SECRET_KEY= "642c4e496cfa2dd0112023f0cb9902a3cfc91e544b84718d6010bf65ef37d701"

//Function to encrypt password using AES encryption
const encryptPassword = (encryptedData) => {
  const secretKey = SECRET_KEY;
  return CryptoJS.AES.encrypt(encryptedData, secretKey).toString();
};

//endpoint URLs
const endpoints =  "http://localhost:3001/user/auth/register" ;
//Function which we use to send data to the backend server
const sendDataToServer = async (endpoint, { username, email, password, phoneNumber }) => {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, phoneNumber }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log("Data sent successfully:", result);
  } catch (error) {
    console.error("Error sending data:", error);
  }
};

// Initial values for Formik
const initialValues = {
  username: "",
  email: "",
  password: "",
  phoneNumber: "",
};
const AuthForm = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(false); // false = Register

  const handleSubmit = (values, { resetForm }) => {
    const { username, email, password, phoneNumber } = values;

    //Username encrypted
    const encryptedUsername = encryptPassword(username);

    //Email encrypted
    const encryptedEmail = encryptPassword(email);

    //Password encrypted
     const encryptedPassword = encryptPassword(password);

     //Phone number encrypted
    const encryptedPhoneNumber = encryptPassword(phoneNumber);

    console.log(`We have on the frontend User name is ${encryptedUsername} Email is ${encryptedEmail} Password is ${encryptedPassword} Phone Number is ${encryptedPhoneNumber}`);


    if (!password || (!isLogin && (!username || !email))) {
      alert("Please fill in all required fields.");
      return;
    }

    alert(`${isLogin ? "Login" : "Registration"} successful!`);
    sendDataToServer(endpoints, { username: encryptedUsername, email: encryptedEmail, password: encryptedPassword, phoneNumber: encryptedPhoneNumber });

    resetForm();
    onClose();
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>×</button>
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
          {({ handleSubmit, errors,touched ,handleChange, setFieldTouched }) => (
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
                  <ErrorMessage name="username" component="div" className="error" />
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
                  <ErrorMessage name="email" component="div" className="error" />
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
                  <ErrorMessage name="phoneNumber" component="div" className="error" />
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
                  <ErrorMessage name="email" component="div" className="error" />
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
