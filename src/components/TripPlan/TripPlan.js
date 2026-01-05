import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import TripPlanValidator from "./TripPlanValidator";
import styles from "./TripPlan.module.css";
import AuthForm from "../AuthForm/AuthForm";
import { sendDataToServer } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Trips data sending api
const host = window.location.hostname;

const tripDetailsapi = `http://${host}:3001/trip/plan`;

const INTEREST_OPTIONS = [
  "Hiking",
  "Historical Places",
  "Shopping",
  "Cultural Events",
];

const TripPlan = ({ initialDestination = "", onClose }) => {
  const navigate = useNavigate();
  const [showAuthForm, setShowAuthForm] = useState({
    show: false,
    mode: "login",
  });
  const initialValues = {
    trip_title: "",
    destination: initialDestination || "",
    interest_areas: [],
    start_date: "",
    end_date: "",
  };

  useEffect(() => {
    const handleAuthModeChanged = (event) => {
      const mode = event.detail?.mode || "login";
      setShowAuthForm({ show: true, mode });
    };
    window.addEventListener("authModeChanged", handleAuthModeChanged);
    return () => {
      window.removeEventListener("authModeChanged", handleAuthModeChanged);
    };
  }, []);

  return (
    <div className={styles.authOverlay} onClick={onClose}>
      <div
        className={styles.authModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className={styles.authClose}
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        {!showAuthForm.show ? (
          <>
            <h2 className={styles.formHeading}>Create Trip Plan</h2>

            <Formik
              initialValues={initialValues}
              validationSchema={TripPlanValidator}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  setSubmitting(true);
                  const responseOfTrip = await sendDataToServer(
                    tripDetailsapi,
                    values
                  );
                  // First success message
                  Swal.fire({
                    title: "Trip Created!",
                    text: responseOfTrip.message,
                    icon: "success",
                    timer: 1200,
                    showConfirmButton: false,
                    timerProgressBar: true,
                  }).then(() => {
                    // Now ask user what to do next
                    Swal.fire({
                      title: "Next Step",
                      text: "Do you want to add your budget now?",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonText: "Yes, Add Budget",
                      cancelButtonText: "Not Now",
                      reverseButtons: true,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        // Redirect to budget page
                        localStorage.clear();
                        navigate("/budget");
                      } else {
                        // Just close modal, stay on current page
                        localStorage.clear();
                        onClose && onClose();
                      }
                    });
                  });
                  resetForm();
                  onClose && onClose();
                } catch (err) {
                  console.log("we check the error ", err);

                  // If token missing or expired (401 error)
                  if (err.TokensExpire === true) {
                    onClose && onClose();
                    Swal.fire({
                      title: "Login Required",
                      text: err.message || "Your session has expired or you are not logged in. Please log in to continue.",
                      icon: "warning",
                      confirmButtonText: "Login",
                    }).then(() => {
                      // Show login popup
                      setShowAuthForm({ show: true, mode: "login" });
                    });

                    return; // stop here
                  }

                  onClose && onClose();
                  // Other errors
                  Swal.fire({
                    title: "Error!",
                    text:
                      err.response?.data?.message ||
                      "Something went wrong while submitting the trip details.",
                    icon: "error",
                    confirmButtonText: "OK",
                  });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({
                values,
                setFieldValue,
                isSubmitting,
                setFieldTouched,
                handleChange,
              }) => (
                <Form className={styles.authForm}>
                  {/* Trip Title */}
                  <label>
                    <div className={styles.inputRow}>
                      <span className={styles.requiredField}>*</span>
                      <Field
                        name="trip_title"
                        type="text"
                        placeholder="Trip Title"
                        className={styles.authInput}
                        onChange={(e) => {
                          handleChange(e);
                          setFieldTouched("trip_title", true, false);
                        }}
                      />
                    </div>
                    <ErrorMessage
                      name="trip_title"
                      component="div"
                      className={styles.error}
                    />
                  </label>

                  {/* Destination */}
                  <label>
                    <div className={styles.inputRow}>
                      <span className={styles.requiredField}>*</span>
                      <Field
                        name="destination"
                        type="text"
                        placeholder="Destination"
                        className={styles.authInput}
                        onChange={(e) => {
                          handleChange(e);
                          setFieldTouched("destination", true, false);
                        }}
                      />
                    </div>
                    <ErrorMessage
                      name="destination"
                      component="div"
                      className={styles.error}
                    />
                  </label>

                  {/* Interest Areas */}
                  <div className={styles.formGroup}>
                    <div className={styles.interestLabel}>
                      <span className={styles.requiredField}>*</span>
                      <div className={styles.interestTitle}>Interest Areas</div>
                    </div>

                    <div className={styles.interestOptions}>
                      {INTEREST_OPTIONS.map((opt) => (
                        <label key={opt} className={styles.interestOption}>
                          <input
                            type="checkbox"
                            name="interest_areas"
                            value={opt}
                            checked={values.interest_areas.includes(opt)}
                            onChange={() => {
                              const next = values.interest_areas.includes(opt)
                                ? values.interest_areas.filter((v) => v !== opt)
                                : [...values.interest_areas, opt];
                              setFieldValue("interest_areas", next);
                              setFieldTouched("interest_areas", true, false);
                            }}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                    <ErrorMessage
                      name="interest_areas"
                      component="div"
                      className={styles.error}
                    />
                  </div>

                  {/* Dates */}
                  <div className={styles.twoCols}>
                    <div>
                      <label
                        htmlFor="start_date"
                        className={styles.labelInline}
                      >
                        Start Date{" "}
                        <span className={styles.requiredField}>*</span>
                      </label>
                      <Field
                        id="start_date"
                        name="start_date"
                        type="date"
                        className={styles.authInput}
                      />
                      <ErrorMessage
                        name="start_date"
                        component="div"
                        className={styles.error}
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <label htmlFor="end_date" className={styles.labelInline}>
                        End Date <span className={styles.requiredField}>*</span>
                      </label>
                      <Field
                        id="end_date"
                        name="end_date"
                        type="date"
                        className={styles.authInput}
                      />
                      <ErrorMessage
                        name="end_date"
                        component="div"
                        className={styles.error}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      className={styles.authBtn}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create Trip Plan"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <AuthForm
            onClose={() => setShowAuthForm({ show: false, mode: "login" })}
            mode={showAuthForm.mode}
            showAuthSwitchText={true}
            onLoginSuccess={() => {
              setShowAuthForm({ show: false, mode: "login" });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TripPlan;
