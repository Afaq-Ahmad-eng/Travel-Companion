import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    adminName: "Admin",
    email: "admin@travelbuddy.com",
    currentPassword: "",
    newPassword: "",
    darkMode: false,
    maintenanceMode: false,
    twoFactorAuth: false,
    emailNotifications: true,
    language: "en",
    timezone: "UTC+05:00",
  });

   const navigate = useNavigate();

  // Apply dark or light mode to the body background
  useEffect(() => {
    document.body.style.backgroundColor = formData.darkMode ? "#1e1e1e" : "#ffffff";
    document.body.style.color = formData.darkMode ? "#f5f5f5" : "#212529";
  }, [formData.darkMode]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Settings Saved",
      text: "✅ All changes have been successfully saved!",
      confirmButtonColor: "#0d6efd",
    }).then(()=>{
         navigate('/AdminDashboard');
    });
    console.log("Saved settings:", formData);
  };

  // Dynamic theme colors
  const cardBg = formData.darkMode ? "#2c2c2c" : "#ffffff";
  const textColor = formData.darkMode ? "#f5f5f5" : "#212529";
  const borderColor = formData.darkMode ? "#444" : "#dee2e6";

  return (
    <div className="w-100 min-vh-100 py-4 px-5" style={{ backgroundColor: cardBg, color: textColor }}>
      <div
        className="card border-0 shadow-lg"
        style={{
          backgroundColor: cardBg,
          color: textColor,
          borderColor: borderColor,
        }}
      >
        <div
          className="card-header text-center fw-bold fs-4 py-3"
          style={{ backgroundColor: formData.darkMode ? "#0d6efd" : "#0d6efd", color: "#fff" }}
        >
          ⚙️ Admin Settings
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit} className="row g-4">
            {/* ---------------- Profile Section ---------------- */}
            <div className="col-12 border-bottom pb-3" style={{ borderColor }}>
              <h5 className="text-primary">👤 Profile Settings</h5>
              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Admin Name</label>
                  <input
                    type="text"
                    name="adminName"
                    className="form-control border-secondary"
                    style={{ backgroundColor: cardBg, color: textColor, borderColor }}
                    value={formData.adminName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control border-secondary"
                    style={{ backgroundColor: cardBg, color: textColor, borderColor }}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* ---------------- Password Section ---------------- */}
            <div className="col-12 border-bottom pb-3" style={{ borderColor }}>
              <h5 className="text-primary">🔐 Change Password</h5>
              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="form-control border-secondary"
                    style={{ backgroundColor: cardBg, color: textColor, borderColor }}
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control border-secondary"
                    style={{ backgroundColor: cardBg, color: textColor, borderColor }}
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* ---------------- System Config Section ---------------- */}
            <div className="col-12 border-bottom pb-3" style={{ borderColor }}>
              <h5 className="text-primary">🧭 System Configuration</h5>
              <div className="form-check form-switch mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="maintenanceMode"
                  checked={formData.maintenanceMode}
                  onChange={handleChange}
                />
                <label className="form-check-label">Enable Maintenance Mode</label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="darkMode"
                  checked={formData.darkMode}
                  onChange={handleChange}
                />
                <label className="form-check-label">Enable Dark Mode</label>
              </div>
            </div>

            {/* ---------------- Security Section ---------------- */}
            <div className="col-12 border-bottom pb-3" style={{ borderColor }}>
              <h5 className="text-primary">🛡️ Security Settings</h5>
              <div className="form-check form-switch mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="twoFactorAuth"
                  checked={formData.twoFactorAuth}
                  onChange={handleChange}
                />
                <label className="form-check-label">
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>

            {/* ---------------- Notification & Integration Section ---------------- */}
            <div className="col-12 border-bottom pb-3" style={{ borderColor }}>
              <h5 className="text-primary">📩 Notifications & Integrations</h5>
              <div className="form-check form-switch mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                />
                <label className="form-check-label">Enable Email Notifications</label>
              </div>
            </div>

            {/* ---------------- Misc Section ---------------- */}
            <div className="col-12 pb-3">
              <h5 className="text-primary">🌍 Miscellaneous</h5>
              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Language</label>
                  <select
                    name="language"
                    className="form-select border-secondary"
                    style={{ backgroundColor: cardBg, color: textColor, borderColor }}
                    value={formData.language}
                    onChange={handleChange}
                  >
                    <option value="en">English</option>
                    <option value="ur">Urdu</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Timezone</label>
                  <select
                    name="timezone"
                    className="form-select border-secondary"
                    style={{ backgroundColor: cardBg, color: textColor, borderColor }}
                    value={formData.timezone}
                    onChange={handleChange}
                  >
                    <option value="UTC+05:00">Pakistan (UTC+05:00)</option>
                    <option value="UTC+00:00">UTC</option>
                    <option value="UTC+04:00">UAE (UTC+04:00)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ---------------- Save Button ---------------- */}
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-5">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
