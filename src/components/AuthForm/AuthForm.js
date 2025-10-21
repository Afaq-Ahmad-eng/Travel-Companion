// import { useState, useEffect } from "react";
// import { Formik, Field, ErrorMessage } from "formik";
// import { validSchema } from "./AuthFormValidator";
// import { encryptData } from "../../utils/secure";
// import { sendDataToServer } from "../../utils/api";
// import Swal from "sweetalert2";
// import "./AuthForm.css";

// const registerEndpoint = "http://localhost:3001/auth/register";
// const loginEndpoint = "http://localhost:3001/auth/login";

// const initialValues = {
//   username: "",
//   email: "",
//   password: "",
//   phoneNumber: "",
//   interest: "",
//   location: "",
// };

// const AuthForm = ({ onClose, fromExperience = false, mode = "login" }) => {
//   const [isLogin, setIsLogin] = useState(mode === "login");

//   useEffect(() => {
//     setIsLogin(mode === "login");
//   }, [mode]);

//   const registrationOrLoginMessage = isLogin ? "Login" : "Registration";

//   const onSubmitForm = async (values, { resetForm }) => {
//     if (isLogin) {
//       const userDataForLogin = {
//         user_email: encryptData(values.email),
//         user_password: encryptData(values.password),
//       };

//       try {
//         const response = await sendDataToServer(loginEndpoint, userDataForLogin);

//         Swal.fire({
//           title: `${response.message}`,
//           text: `Welcome, ${response.user.user_name}!`,
//           icon: "success",
//           timer: 1800,
//           showConfirmButton: false,
//         }).then(() => {

//           if (fromExperience) {
//             const pending = localStorage.getItem("pendingExperienceForm");

//             if (pending) {

//               const restoredData = JSON.parse(pending);
//               window.dispatchEvent(
//                 new CustomEvent("restoreExperienceForm", { detail: restoredData })
//               );
//               localStorage.removeItem("pendingExperienceForm");
//             }
//           }
//         });
//         onClose();
//       } catch (error) {
//         const isUserRegister = error?.response?.data?.isUserRegister ?? null;
//         onClose();
//         Swal.fire({
//           title: `${registrationOrLoginMessage} Failed`,
//           text: error?.response?.data?.message || "Invalid credentials. Please try again.",
//           icon: "error",
//           confirmButtonText: isUserRegister === false ? "Continue to Registration" : "Retry Login",
//           confirmButtonColor: "#d33",
//         }).then((result) => {
//           if (result.isConfirmed && fromExperience) {
//             const nextMode = isUserRegister === false ? "register" : "login";
//             setTimeout(() => {
//               window.dispatchEvent(
//                 new CustomEvent("showAuthFormAgain", { detail: { mode: nextMode } })
//               );
//             }, 300);
//           }
//         });
//       }
//     } else {
//       const userDataForRegistration = {
//         username: encryptData(values.username),
//         email: encryptData(values.email),
//         password: encryptData(values.password),
//         phoneNumber: encryptData(values.phoneNumber),
//         interest: encryptData(values.interest),
//         location: encryptData(values.location),
//       };

//       try {
//         const response = await sendDataToServer(registerEndpoint, userDataForRegistration);
//         onClose();
//         Swal.fire({
//           title: `Registration Successful!`,
//           text: `Welcome, ${response.response.username}! ${response.message}`,
//           icon: "success",
//           timer: 1500,
//           showConfirmButton: false,
//         }).then(() => {
//           resetForm();
//           setTimeout(() => {
//             window.dispatchEvent(
//               new CustomEvent("showAuthFormAgain", { detail: { mode: "login" } })
//             );
//           }, 500);
//         });

//         if (fromExperience) {
//           const savedForm = localStorage.getItem("pendingExperienceForm");
//           if (savedForm) {
//             const restoredData = JSON.parse(savedForm);
//             window.dispatchEvent(
//               new CustomEvent("restoreExperienceForm", { detail: restoredData })
//             );
//           }
//         }
//       } catch (error) {
//         onClose();
//         Swal.fire({
//           title: `Registration Failed`,
//           text: error?.response?.data?.message || "Something went wrong.",
//           icon: "error",
//           confirmButtonText: "Continue",
//           confirmButtonColor: "#d33",
//         });
//       }
//     }
//   };

//   return (
//     <div className="auth-overlay" onClick={onClose}>
//       <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
//         <button className="auth-close" onClick={onClose}>×</button>
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validSchema(isLogin)}
//           validateOnChange
//           validateOnBlur
//           onSubmit={onSubmitForm}
//         >
//           {({ handleSubmit, handleChange, setFieldTouched }) => (
//             <form onSubmit={handleSubmit} className="auth-form">
//               <h2>{isLogin ? "Login" : "Register"}</h2>

//               {!isLogin && (
//                 <>
//                   <Field
//                     name="username"
//                     type="text"
//                     placeholder="Full Name"
//                     className="auth-input"
//                     onChange={(e) => { handleChange(e); setFieldTouched("username", true, false); }}
//                   />
//                   <ErrorMessage name="username" component="div" className="error" />

//                   <Field
//                     name="interest"
//                     type="text"
//                     placeholder="Interest area(s)"
//                     className="auth-input"
//                     onChange={(e) => { handleChange(e); setFieldTouched("interest", true, false); }}
//                   />
//                   <ErrorMessage name="interest" component="div" className="error" />

//                   <Field
//                     name="location"
//                     type="text"
//                     placeholder="Your location"
//                     className="auth-input"
//                     onChange={(e) => { handleChange(e); setFieldTouched("location", true, false); }}
//                   />
//                   <ErrorMessage name="location" component="div" className="error" />

//                   <Field
//                     name="phoneNumber"
//                     type="text"
//                     placeholder="Phone Number (e.g., +923001234567)"
//                     className="auth-input"
//                     onChange={(e) => { handleChange(e); setFieldTouched("phoneNumber", true, false); }}
//                   />
//                   <ErrorMessage name="phoneNumber" component="div" className="error" />
//                 </>
//               )}

//               <Field
//                 name="email"
//                 type="email"
//                 placeholder="Email"
//                 className="auth-input"
//                 onChange={(e) => { handleChange(e); setFieldTouched("email", true, false); }}
//               />
//               <ErrorMessage name="email" component="div" className="error" />

//               <Field
//                 name="password"
//                 type="password"
//                 placeholder="Password"
//                 className="auth-input"
//                 onChange={(e) => { handleChange(e); setFieldTouched("password", true, false); }}
//               />
//               <ErrorMessage name="password" component="div" className="error" />

//               <button type="submit" className="auth-btn">
//                 {isLogin ? "Login" : "Register"}
//               </button>

//               {!fromExperience && (
//                 <p className="auth-toggle" onClick={() => setIsLogin(prev => !prev)}>
//                   {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
//                 </p>
//               )}
//             </form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default AuthForm;

import { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { validSchema } from "./AuthFormValidator";
import { encryptData } from "../../utils/secure";
import { sendDataToServer } from "../../utils/api";
import Swal from "sweetalert2";
import "./AuthForm.css";

const registerEndpoint = "http://localhost:3001/auth/register";
const loginEndpoint = "http://localhost:3001/auth/login";

const initialValues = {
  username: "",
  email: "",
  password: "",
  phoneNumber: "",
  interest: "",
  location: "",
};

const AuthForm = ({
  onClose,
  mode = "login",
  onLoginSuccess,
  showAuthSwitchText = true
}) => {
  const [isLogin, setIsLogin] = useState(mode === "login");

  useEffect(() => {
    setIsLogin(mode === "login");
  }, [mode]);

  const onSubmitForm = async (values, { resetForm }) => {
    if (isLogin) {
      // 🔹 LOGIN FLOW
      const userDataForLogin = {
        user_email: encryptData(values.email),
        user_password: encryptData(values.password),
      };

      try {
        const response = await sendDataToServer(
          loginEndpoint,
          userDataForLogin
        );
        onClose();
        Swal.fire({
          title: `${response.message}`,
          text: `Welcome, ${response.user.user_name}!`,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          if (onLoginSuccess) onLoginSuccess(); // ✅ trigger profile refresh

          const pending = localStorage.getItem("pendingExperienceForm");
          if (pending) {
            const restoredData = JSON.parse(pending);
            console.log("✅ Restoring experience form data:", restoredData);

            // 🧠 Fire the restore event
            window.dispatchEvent(
              new CustomEvent("restoreExperienceForm", { detail: restoredData })
            );

            // ✅ Remove from localStorage only after firing
            localStorage.removeItem("pendingExperienceForm");
          }
        });
      } catch (error) {
        const isUserRegister = error?.response?.data?.isUserRegister ?? null;
        onClose();
        Swal.fire({
          title: `Login Failed`,
          text:
            error?.response?.data?.message ||
            "Invalid credentials. Please try again.",
          icon: "error",
          confirmButtonText:
            isUserRegister === false
              ?  showAuthSwitchText ? "Sign Up" : "Continue to Registration" 
              : "Retry Login",
          confirmButtonColor: "#3085d6",
        }).then((result) => {
          if (result.isConfirmed) {
            const nextMode = isUserRegister === false ? "register" : "login";
            setTimeout(() => {
              window.dispatchEvent(
                new CustomEvent("showAuthFormAgain", {
                  detail: { mode: nextMode },
                })
              );
            }, 300);
          }
        });
      }
    } else {
      // 🔹 REGISTRATION FLOW
      const userDataForRegistration = {
        username: encryptData(values.username),
        email: encryptData(values.email),
        password: encryptData(values.password),
        phoneNumber: encryptData(values.phoneNumber),
        interest: encryptData(values.interest),
        location: encryptData(values.location),
      };

      try {
        const response = await sendDataToServer(
          registerEndpoint,
          userDataForRegistration
        );
        onClose();
        Swal.fire({
          title: `Registration Successful!`,
          text: `${response.message}`,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          resetForm();
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("showAuthFormAgain", {
                detail: { mode: "login" },
              })
            );
          }, 500);
        });
      } catch (error) {
        onClose();
        Swal.fire({
          title: `Registration Failed`,
          text:
            error?.response?.data?.message ||
            "Something went wrong. Try again.",
          icon: "error",
          confirmButtonText: "Continue",
          confirmButtonColor: "#d33",
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
          initialValues={initialValues}
          validationSchema={validSchema(isLogin)}
          validateOnChange
          validateOnBlur
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
                    placeholder="Full Name"
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
                    name="interest"
                    type="text"
                    placeholder="Interest area(s)"
                    className="auth-input"
                    onChange={(e) => {
                      handleChange(e);
                      setFieldTouched("interest", true, false);
                    }}
                  />
                  <ErrorMessage
                    name="interest"
                    component="div"
                    className="error"
                  />

                  <Field
                    name="location"
                    type="text"
                    placeholder="Your location"
                    className="auth-input"
                    onChange={(e) => {
                      handleChange(e);
                      setFieldTouched("location", true, false);
                    }}
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="error"
                  />

                  <Field
                    name="phoneNumber"
                    type="text"
                    placeholder="Phone Number (e.g., +923001234567)"
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

              {showAuthSwitchText && (
                <p
                  className="auth-toggle"
                  onClick={() => setIsLogin((prev) => !prev)}
                >
                  {isLogin
                    ? "Don't have an account? Register"
                    : "Already have an account? Login"}
                </p>
              )}
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AuthForm;
