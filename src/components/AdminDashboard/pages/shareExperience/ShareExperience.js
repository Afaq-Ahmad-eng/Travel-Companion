import { useEffect, useState } from "react";
import {
  fetchDataFromServer,
  sendDataToServer,
} from "../../../../utils/api.js";
import Swal from "sweetalert2";

export default function ShareExperience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetchDataFromServer(
          "http://localhost:3001/admin/user-experiences"
        );
        setExperiences(res.data || []);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to load experiences",
          text: error?.message || "Something went wrong!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await sendDataToServer(
        `http://localhost:3001/admin/user-experiences/${id}/${action}`
      );
      Swal.fire({
        icon: "success",
        title: `${action} successful`,
        text: res.message,
      });
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `Failed to ${action}`,
        text: error?.message || "Something went wrong!",
      });
    }
  };

  if (loading) return <p className="text-center mt-4">Loading user experiences...</p>;
  if (experiences.length === 0) return <p className="text-center mt-4">No user experiences to display.</p>;

  return (
    <div
      className="user-experiences p-4 shadow-sm rounded bg-white"
      style={{ border: "1px solid #e5e5e5" }}
    >
      <h2 className="mb-4 text-center fw-bold">Users' Shared Experiences</h2>

      <table className="table table-striped table-hover table-bordered align-middle">
        <thead className="table-primary">
          <tr>
            <th>S.No</th>
            <th>User</th>
            <th>Destination</th>
            <th>Experience</th>
            <th>Rating</th>
            <th>Completed Date</th>
          </tr>
        </thead>

        <tbody>
          {experiences.map((exp, index) => (
            <tr key={exp.id}>
              <td className="fw-semibold">{index + 1}</td>
              <td>{exp?.trips?.user?.user_name}</td>
              <td>{exp?.trips?.destination}</td>
              <td style={{ maxWidth: "300px" }}>{exp.description}</td>
              <td>
                <span className="badge bg-success p-2 fs-6">{exp.rating}</span>
              </td>
              <td>
                {new Date(exp.trips.end_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
