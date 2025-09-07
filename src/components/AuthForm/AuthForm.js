import { useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { validSchema } from "./AuthFormValidator";
import "./AuthForm.css";

// Initial values for Formik
const initialValues = {
  username: "",
  email: "",
  password: "",
};
const AuthForm = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(false); // false = Register

  const handleSubmit = (values, { resetForm }) => {
    const { username, email, password } = values;

    if (!password || (!isLogin && (!username || !email))) {
      alert("Please fill in all required fields.");
      return;
    }

    alert(`${isLogin ? "Login" : "Registration"} successful!`);
    console.log("Form Data:", values);
    resetForm();
    onClose();
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>×</button>
        <Formik
          initialValues={initialValues}
          validationSchema={validSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="auth-form">
              <h2>{isLogin ? "Login" : "Register"}</h2>

              {!isLogin && (
                <>
                  <Field
                    name="username"
                    type="text"
                    placeholder="Username"
                    className="auth-input"
                  />
                  <ErrorMessage name="username" component="div" className="error" />

                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="auth-input"
                  />
                  <ErrorMessage name="email" component="div" className="error" />
                </>
              )}

              {isLogin && (
                <>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="auth-input"
                  />
                  <ErrorMessage name="email" component="div" className="error" />
                </>
              )}

              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="auth-input"
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
