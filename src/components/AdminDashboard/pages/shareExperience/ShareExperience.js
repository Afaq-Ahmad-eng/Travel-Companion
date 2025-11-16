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
        console.log("we check the response for the experience ", res);

        setExperiences(res.data || []);
      } catch (error) {
        console.error("Error fetching experiences:", error);
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

      // Update list locally
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `Failed to ${action}`,
        text: error?.message || "Something went wrong!",
      });
    }
  };

  if (loading) return <p>Loading user experiences...</p>;

  if (experiences.length === 0) return <p>No user experiences to display.</p>;

  return (
    <div className="user-experiences">
      <h2 className="mb-4">Users' Shared Experiences</h2>
      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
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
              <td>{index + 1}</td>
              <td>{exp?.trips?.user?.user_name}</td>
              <td>{exp?.trips?.destination}</td>
              <td>{exp.description}</td>
              <td>{exp.rating}</td>
              <td>
                {new Date(exp.trips.end_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              {/* <td>
          <button
            className="btn btn-success btn-sm me-2"
            onClick={() => handleAction(exp.id, "approve")}
          >
            Approve
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleAction(exp.id, "reject")}
          >
            Reject
          </button>
        </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
