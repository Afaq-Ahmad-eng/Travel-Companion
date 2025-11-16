import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./ResolvedReports.module.css";
import { fetchDataFromServer } from "../../../../../utils/api";
import { decryptData } from "../../../../../utils/secure";

const ResolvedReports = () => {
  const navigate = useNavigate();
  const resolvedReportsApi = `http://localhost:3001/admin/resolved/complaints-data`; // (You can rename this if your backend endpoint differs)
  const [complaints, setComplaints] = useState([]);
  const [messageForAdmin, setMessageForAdmin] = useState(null);
  const [messageForAdminColor, setMessageForAdminColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // 👈 for full screen image

  // Fetch all resolved complaints
  const fetchComplaints = useCallback(async () => {
    try {
      const res = await fetchDataFromServer(resolvedReportsApi);
      console.log("We are the resolved reports components frontend ", res);

      const allComplaints = res?.data?.resolvedComplaints || [];
      const resolvedComplaints = allComplaints.filter((c) => c.isResolved);
      setComplaints(resolvedComplaints);

      if (resolvedComplaints.length === 0) {
        setMessageForAdmin("No resolved complaints found.");
        setMessageForAdminColor("red");
      } else {
        setMessageForAdmin(
          `Showing ${resolvedComplaints.length} resolved complaint(s).`
        );
        setMessageForAdminColor("green");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch complaints", "error");
    }
  }, [resolvedReportsApi]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleBack = () => navigate(-1);

  return (
    <div className={styles.reportContainer}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">Resolved User Complaints</h2>
        <button
          onClick={handleBack}
          className="btn btn-outline-secondary btn-sm"
        >
          ⬅️ Back
        </button>
      </div>

      {messageForAdmin && (
        <div
          className="text-center mb-3"
          style={{ color: messageForAdminColor, fontWeight: "bold" }}
        >
          {messageForAdmin}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle text-center shadow-sm">
          <thead className="table-success">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Subject</th>
              <th>Description</th>
              <th>Type of Issue</th>
              <th>Picture</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? (
              complaints.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.user?.user_name || "—"}</td>
                  <td>{c.subject}</td>
                  <td>{c.description}</td>
                  <td>{c.category}</td>
                  <td>
                    {c.fileUrl ? (
                      <img
                        src={decryptData(c.fileUrl)}
                        alt={c.subject}
                        className={styles.thumbnail}
                        onClick={() => setSelectedImage(decryptData(c.fileUrl))}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="fw-semibold text-success">Entertained ✅</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-muted py-3">
                  No resolved complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 👇 Fullscreen Image Modal */}
      {selectedImage && (
        <div
          className={styles.imageModal}
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Complaint Full View" />
        </div>
      )}
    </div>
  );
};

export default ResolvedReports;
