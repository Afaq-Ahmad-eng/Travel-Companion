import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { adminSettingsValidation } from "./adminSettingsValidation";
import AuthForm from "../../AuthForm/AuthForm";
import { useState, useEffect } from "react";
import { fetchDataFromServer, putDataToServer } from "../../../utils/api";

export default function AdminSettings() {
  const [adminData, setAdminData] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState({
    show: false,
    mode: "register",
  });
  const navigate = useNavigate();

  

  useEffect(() => {
    const adminDataForUpdation = async () => {
      const response = await fetchDataFromServer(
        "http://localhost:3001/admin/admin-data-for-update"
      );
      setAdminData(response.adminData);
    };
    adminDataForUpdation();
  }, []);

  // NEW: extract submit logic into its own function so Formik onSubmit calls it
  const handleSaveAdminSettings = async (values) => {
    try {
      const id = adminData?.id; // Hardcoded admin ID for now
      // You can replace the console.log with an API call (axios/fetch) to save the settings:
      const result = await putDataToServer(`http://localhost:3001/admin/update/${id}`, values);
      console.log("Updated Admin Settings (to be saved):", result);

      // show confirmation and then navigate back to AdminDashboard
      Swal.fire({
        icon: "success",
        title: "Admin Settings Updated",
        confirmButtonColor: "#0d6efd",
      }).then(() => {
        navigate("/AdminDashboard");
      });
    } catch (err) {
      console.error("Failed to save admin settings:", err);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err?.message || "Unable to save admin settings. Try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (!adminData) {
    return <h3 className="text-center mt-5">Loading admin data...</h3>;
  }
  // Initial values (Replace with API response later)
  const initialValues = {
    adminName: adminData.adminName || "",
    email: adminData.adminEmail || "",
    phone: adminData.adminPhoneno || "",
    location: adminData.adminLocaton || "",
    password: adminData.adminPassword || "",
  };


  if (showAuthForm.show) {
    return (
      <AuthForm
        mode={showAuthForm.mode} // <-- FIX: pass the mode string, not the boolean
        isAdminLogin={true}
        onClose={() => setShowAuthForm({ show: false, mode: "" })}
        showAuthSwitchText={false}
      />
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow-lg p-4">
        <h3 className="text-center mb-4">⚙️ Admin Settings</h3>

        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={adminSettingsValidation}
          onSubmit={async (values, actions) => {
            try {
              actions.setSubmitting(true);
              await handleSaveAdminSettings(values);
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="row g-4">
              {/* Admin Name */}
              <div className="col-md-6">
                <label className="fw-bold">Admin Name</label>
                <Field name="adminName" className="form-control" />
                <ErrorMessage
                  name="adminName"
                  className="text-danger"
                  component="small"
                />
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label className="fw-bold">Email</label>
                <Field name="email" type="email" className="form-control" />
                <ErrorMessage
                  name="email"
                  className="text-danger"
                  component="small"
                />
              </div>

              {/* Phone */}
              <div className="col-md-6">
                <label className="fw-bold">Phone Number</label>
                <Field name="phone" className="form-control" />
                <ErrorMessage
                  name="phone"
                  className="text-danger"
                  component="small"
                />
              </div>

              {/* Location */}
              <div className="col-md-6">
                <label className="fw-bold">Location</label>
                <Field name="location" className="form-control" />
                <ErrorMessage
                  name="location"
                  className="text-danger"
                  component="small"
                />
              </div>

              {/* Current Password */}
              <div className="col-md-6">
                <label className="fw-bold">Password</label>
                {/* normalize the field name to lowercase to match initialValues */}
                <Field
                  name="password"
                  type="text"
                  className="form-control"
                />
                <ErrorMessage
                  name="Password"
                  className="text-danger"
                  component="small"
                />
              </div>

              {/* Add More Admin Button */}
              <div className="col-12 text-end">
                <button
                  className="btn btn-outline-success"
                  type="button"
                  onClick={() => setShowAuthForm({ show: true, mode: "register" })}
                >
                  ➕ Add More Admin
                </button>
              </div>

              {/* Save Button */}
              <div className="col-12 text-center">
                <button
                  type="submit"
                  className="btn btn-primary px-5"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
