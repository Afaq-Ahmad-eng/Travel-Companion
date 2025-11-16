import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./UserReport.module.css";
import { fetchDataFromServer } from "../../../../utils/api";
import axios from "axios";

const UserReport = () => {
  const navigate = useNavigate();
  const userUnresolvedReportsApi = `http://localhost:3001/admin/un-resolved/complaints`;
  const [complaints, setComplaints] = useState([]);
  const [messageForAdmin, setMessageForAdmin] = useState(null);
  const [messageForAdminColor, setMessageForAdminColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // 👈 for full screen image

  // 🔹 Fetch unresolved complaints
  const fetchComplaints = useCallback(async () => {
    try {
      const res = await fetchDataFromServer(userUnresolvedReportsApi);
      const unresolvedComplaints = res?.userComplaintsData || [];
      setComplaints(unresolvedComplaints);

      if (unresolvedComplaints.length === 0) {
        setMessageForAdmin("No unresolved complaints found.");
        setMessageForAdminColor("red");
      } else {
        setMessageForAdmin(
          `Showing ${unresolvedComplaints.length} unresolved complaint(s).`
        );
        setMessageForAdminColor("green");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch complaints", "error");
    }
  }, [userUnresolvedReportsApi]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // 🔹 Mark complaint as resolved
  const handleResolve = async (report_id, user_name, category) => {
    try {
      await axios.put(`http://localhost:3001/admin/${report_id}/Resolved`);
      setMessageForAdmin(
        `${user_name}'s complaint about "${category}" has been successfully resolved ✅`
      );
      setMessageForAdminColor("green");
      fetchComplaints();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed to resolve complaint",
        icon: "error",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <div className={styles.reportContainer}>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">Unresolved User Complaints</h2>
        <button onClick={handleBack} className="btn btn-outline-secondary btn-sm">
          ⬅️ Back
        </button>
      </div>

      {/* ADMIN MESSAGE */}
      {messageForAdmin && (
        <div
          className="text-center mb-3"
          style={{ color: messageForAdminColor, fontWeight: "bold" }}
        >
          {messageForAdmin}
        </div>
      )}

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle text-center shadow-sm">
          <thead className="table-warning">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Subject</th>
              <th>Description</th>
              <th>Type of Issue</th>
              <th>Picture</th>
              <th>Status</th>
              <th>Action</th>
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
                        src={c.fileUrl}
                        alt={c.subject}
                        className={styles.thumbnail}
                        onClick={() => setSelectedImage(c.fileUrl)} // open full screen
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="fw-semibold text-danger">
                    {c.isResolved ? "Entertained ✅" : "Pending ⏳"}
                  </td>
                  <td>
                    {!c.isResolved ? (
                      <button
                        onClick={() =>
                          handleResolve(c.id, c.user?.user_name, c.category)
                        }
                        className="btn btn-sm btn-success"
                      >
                        Mark as Entertained
                      </button>
                    ) : (
                      "This complaint has been entertained"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-muted py-3">
                  No unresolved complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FULLSCREEN IMAGE MODAL */}
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

export default UserReport;
