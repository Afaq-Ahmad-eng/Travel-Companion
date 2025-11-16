import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStar, FaRegStar } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validSchema } from "./ExperienceFormValidator";
import { sendDataToServer, fetchDataFromServer } from "../../utils/api";
import AuthForm from "../AuthForm/AuthForm";
import Swal from "sweetalert2";
import "./ExperienceForm.css";
import { useState, useEffect, useRef } from "react";

const host = window.location.hostname;

const shareExperienceApi = `http://${host}:3001/share/experience`;
const fatchLatestTripApi = `http://${host}:3001/share/fetch-latest-trip`;

const ExperienceForm = () => {
  const [showAuthForm, setShowAuthForm] = useState({
    show: false,
    mode: "login",
    pendingValues: null,
  });

  const [userDataForReFilling, setUserDataForReFilling] = useState({});
  const [refetchLatestTripData, setRefetchLatestTripData] = useState(false);

  const formikRef = useRef(null);
  const navigate = useNavigate();

  // Reopen AuthForm event listener
  useEffect(() => {
    const handleShowAuthFormAgain = (event) => {
      const mode = event.detail?.mode || "login";
      setShowAuthForm((prev) => ({
        show: true,
        mode,
        pendingValues: prev.pendingValues || null,
      }));
    };
    window.addEventListener("showAuthFormAgain", handleShowAuthFormAgain);
    return () =>
      window.removeEventListener("showAuthFormAgain", handleShowAuthFormAgain);
  }, []);

  // Restore ExperienceForm fields from event
  useEffect(() => {
    const handleRestoreForm = (event) => {
      const restoredData = event.detail;
      if (formikRef.current && restoredData) {
        formikRef.current.setFieldValue("title", restoredData.title || "");
        formikRef.current.setFieldValue(
          "description",
          restoredData.description || ""
        );
        formikRef.current.setFieldValue("blog", restoredData.blog || "");
        formikRef.current.setFieldValue("rating", restoredData.rating || null);
        formikRef.current.setFieldValue("images", restoredData.images || []);
      }
    };
    window.addEventListener("restoreExperienceForm", handleRestoreForm);
    return () =>
      window.removeEventListener("restoreExperienceForm", handleRestoreForm);
  }, []);

  useEffect(() => {
    const latestTripData = async () => {
      try {
        const response = await fetchDataFromServer(fatchLatestTripApi);
        console.log("Latest trip data fetched:", response.data);
        if (formikRef.current && response.data) {
          formikRef.current.setFieldValue(
            "title",
            response?.data.trip_title || ""
          );
        }
      } catch (error) {
        console.error("Error fetching latest trip data:", error);
        if (error?.response?.data?.showLoginAndRegistrationForm) {
          const errData = error?.response?.data || {};
          const errorMsg = errData.message || "Unexpected error occurred.";
          console.log("Show data ", errData.isUserRegister);

          Swal.fire({
            title: "Access Denied",
            text: errorMsg,
            icon: "warning",
            confirmButtonText: errData.isExperienceTitleExist
              ? "Click to continue"
              : "Continue to Login",
            confirmButtonColor: "#3085d6",
            background: "#ffffff",
            color: "#333",
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.setItem(
                "pendingExperienceForm",
                JSON.stringify(userDataForReFilling)
              );
              setShowAuthForm({
                show: true,
                mode: errData.isUserRegister === false ? "register" : "login",
                pendingValues: userDataForReFilling,
              });
            }
          });
        } else if (error?.response?.data?.showNavigation) {
          Swal.fire({
            title: "Error",
            text:
              error?.response?.data?.message ||
              "Could not fetch latest trip data.",
            icon: "error",
            confirmButtonText: "Go to Home Page",
          }).then(() => {
            navigate("/");
          });
        }
      }
    };
    latestTripData();
  }, [navigate, userDataForReFilling, refetchLatestTripData]);

  const initialValues = {
    title: "",
    description: "",
    blog: "",
    images: [],
    rating: null,
  };

  const handleExperienceSubmit = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    try {
      setUserDataForReFilling(values);
      const response = await sendDataToServer(shareExperienceApi, values);
      Swal.fire({
        title: response.message,
        text: `Thank you! Your experience has been shared successfully.`,
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        // confirmButtonText: "Awesome!",
        // confirmButtonColor: "#3085d6",
        // background: "#ffffff",
        // color: "#333",
      });
      resetForm();
    } catch (error) {
      console.log("we get error at share experience  ", error);

      Swal.fire({
        icon: "error",
        title: "Failed to Share Experience",
        text:
          error?.message ||
          "Something went wrong while sharing your experience. Please try again later.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Click to Correct and Continue",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="experience-bg-wrapper"
      style={{
        backgroundImage: 'url("/budget2-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundRepeat: "no-repeat",
      }}
    >
      {!showAuthForm.show ? (
        <div className="experience-form-container">
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validSchema}
            onSubmit={handleExperienceSubmit}
          >
            {({
              values,
              setFieldValue,
              isSubmitting,
              handleChange,
              setFieldTouched,
            }) => (
              <Form className="experience-form">
                <h2>Share Your Trip Experience</h2>

                <div className="form-group">
                  <label htmlFor="title">
                    Trip Title <span className="required-field">*</span>
                  </label>
                  <Field
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter trip title (Trip to Kalam)..."
                    value={values.title}
                    readOnly
                    onChange={(e) => {
                      handleChange(e);
                      setFieldTouched("title", true, false);
                    }}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">
                    Description <span className="required-field">*</span>
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows="3"
                    placeholder="Short description of the trip"
                    onChange={(e) => {
                      handleChange(e);
                      setFieldTouched("description", true, false);
                    }}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="blog">Trip Blog (10–20 lines)</label>
                  <Field
                    as="textarea"
                    id="blog"
                    name="blog"
                    rows="15"
                    placeholder="Share your full trip story..."
                    onChange={(e) => {
                      handleChange(e);
                      setFieldTouched("blog", true, false);
                    }}
                  />
                  <ErrorMessage name="blog" component="div" className="error" />
                </div>

                <div className="form-group">
                  <label htmlFor="images">
                    Upload Photos (max 20){" "}
                    <span className="required-field">*</span>
                  </label>
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 20) {
                        Swal.fire(
                          "Limit exceeded",
                          "Please upload no more than 20 images.",
                          "warning"
                        );
                        return;
                      }
                      setFieldValue("images", files);
                    }}
                  />
                  <small>{values.images.length} images selected</small>
                  <ErrorMessage
                    name="images"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Rate Your Experience{" "}
                    <span className="required-field">*</span>
                  </label>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= values.rating ? "filled" : ""}
                        onClick={() => setFieldValue("rating", star)}
                      >
                        {star <= values.rating ? <FaStar /> : <FaRegStar />}
                      </span>
                    ))}
                  </div>
                  <ErrorMessage
                    name="rating"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Experience"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="back-container">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/services")}
            >
              <FaArrowLeft /> Back to Services
            </button>
          </div>
        </div>
      ) : (
        <AuthForm
          onClose={() =>
            setShowAuthForm({ show: false, mode: "login", pendingValues: null })
          }
          showAuthSwitchText={false}
          mode={showAuthForm.mode}
          onLoginSuccess={() => {
            // pending values are restored via "restoreExperienceForm" event
            setShowAuthForm({
              show: false,
              mode: "login",
              pendingValues: null,
            });
            setRefetchLatestTripData((prev) => !prev);
          }}
        />
      )}
    </div>
  );
};

export default ExperienceForm;
