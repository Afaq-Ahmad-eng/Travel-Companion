import { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { validSchema } from "./AuthFormValidator";
import { encryptData } from "../../utils/secure";
import { sendDataToServer } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./AuthForm.css";

const host = window.location.hostname;

const endpoints = {
  user: {
    register: `http://${host}:3001/auth/user/register`,
    login: `http://${host}:3001/auth/user/login`,
  },
  admin: {
    register: `http://${host}:3001/auth/admin/register`,
    login: `http://${host}:3001/auth/admin/login`,
  },
};

const initialValues = {
  username: "",
  email: "",
  password: "",
  phoneNumber: "",
  location: "",
};

const AuthForm = ({
  onClose,
  mode = "login",
  onLoginSuccess,
  showAuthSwitchText = true,
  role = "user",
}) => {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(mode === "login");

  const [headingPrefix, setHeadingPrefix] = useState("");
  const [submitRole, setSubmitRole] = useState(role);

  const handleEmailChange = (e, handleChange, setFieldTouched) => {
    const emailValue = e.target.value.toLowerCase();
    handleChange(e);
    setFieldTouched("email", true, false);

    const domainPart = emailValue.split("@")[1] || "";

    if (
      domainPart.startsWith("s") ||
      domainPart.includes("smarttravelcompanion.com")
    ) {
      setHeadingPrefix("Admin ");
      setSubmitRole("admin");
    } else {
      setHeadingPrefix("");
      setSubmitRole("user");
    }
  };

  useEffect(() => {
    setIsLogin(mode === "login");
  }, [mode]);

  const onSubmitForm = async (values, { resetForm }) => {
    const currentRole = submitRole;

    if (isLogin) {
      // LOGIN FLOW
      const userDataForLogin = {
        user_email: encryptData(values.email),
        user_password: encryptData(values.password),
      };

      try {
        const response = await sendDataToServer(
          currentRole === "admin"
            ? endpoints.admin.login
            : endpoints.user.login,
          userDataForLogin
        );
        onClose();
        Swal.fire({
          title: `${response.message}`,
          text: `Welcome, ${response?.user?.user_name}!`,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          if (onLoginSuccess) onLoginSuccess(); // trigger profile refresh


          if(response?.adminLoginSuccessful){
           return navigate('/AdminDashboard');
          }

          const pending = localStorage.getItem("pendingExperienceForm");
          if (pending) {
            const restoredData = JSON.parse(pending);
            // Fire the restore event
            window.dispatchEvent(
              new CustomEvent("restoreExperienceForm", { detail: restoredData })
            );

            // Remove from localStorage only after firing
            localStorage.removeItem("pendingExperienceForm");
          }
        });
      // } catch (error) {
      //   console.log("We get error aaaasasa ", error);
      //   if(error?.isUserRegister){
      //     const isUserRegister = error?.isUserRegister ?? null;
      //     console.log("We get is user register boolean ", isUserRegister);
      //   } else if(error?.isAdminRegister){

      //   }


      //   onClose();
      //   Swal.fire({
      //     title: `Login Failed`,
      //     text: error?.message || "Invalid credentials. Please try again.",
      //     icon: "error",
      //     confirmButtonText:
      //       isUserRegister === false
      //         ? showAuthSwitchText
      //           ? "Sign Up"
      //           : "Continue to Registration"
      //         : "Retry Login",
      //     confirmButtonColor: "#3085d6",
      //   }).then((result) => {
      //     onClose();
      //     if (result.isConfirmed) {
      //       const nextMode = isUserRegister === false ? "register" : "login";
      //       setTimeout(() => {
      //         window.dispatchEvent(
      //           new CustomEvent("showAuthFormAgain", {
      //             detail: { mode: nextMode },
      //           })
      //         );
      //       }, 300);
      //     }
      //   });
      // }

 } catch (error) {
  console.log("We got an error: ", error);

  // Declare outside so it's accessible in Swal
  let isUserRegister = null;
  let isAdminRegister = null;

  // Handle flags
  if (typeof error?.isUserRegister !== "undefined") {
    isUserRegister = error.isUserRegister;
    console.log("User register flag: ", isUserRegister);
  } 
  
  if (typeof error?.isAdminRegister !== "undefined") {
    isAdminRegister = error.isAdminRegister;
    console.log("Admin register flag: ", isAdminRegister);
  }

  // Always close the loader / modal before showing alert
  onClose();

  // Dynamic SweetAlert text and behavior
  Swal.fire({
    title: "Login Failed",
    text: error?.message || "Invalid credentials. Please try again.",
    icon: "error",
    confirmButtonText:
      isUserRegister === false
        ? "Continue to Registration"
        : "Retry Login",
    confirmButtonColor: "#3085d6",
  }).then((result) => {
    if (result.isConfirmed) {
      const nextMode = isUserRegister === false ? "register" : "login";

      // Wait a bit for animation smoothness
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
      // REGISTRATION FLOW
      const userDataForRegistration = {
        username: encryptData(values.username),
        email: encryptData(values.email),
        password: encryptData(values.password),
        phoneNumber: encryptData(values.phoneNumber),
        location: encryptData(values.location),
      };

      try {
        const response = await sendDataToServer(
          currentRole === "admin"
            ? endpoints.admin.register
            : endpoints.user.register,
          userDataForRegistration
        );
        onClose();
        Swal.fire({
          title: `Registration Successful!`,
          text: `${response.message}`,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
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
          {({ handleSubmit, handleChange, setFieldTouched, values }) => {
            return (
              <form onSubmit={handleSubmit} className="auth-form">
                <h2>
                  {headingPrefix}
                  {isLogin ? "Login" : "Register"}
                </h2>

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
                  onChange={(e) =>
                    handleEmailChange(e, handleChange, setFieldTouched)
                  }
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
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />

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
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AuthForm;
