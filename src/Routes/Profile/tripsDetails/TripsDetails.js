import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TripsDetails.module.css";

const TripsTable = ({ trips }) => {
  const navigate = useNavigate();

  //Helper to check if a trip has shared experience
  const hasSharedExperience = (trip) => {
    const se = trip.share_experiences ?? trip.share_experience ?? null;
    if (!se) return false;
    if (Array.isArray(se)) return se.length > 0;
    if (typeof se === "object") return Object.keys(se).length > 0;
    return Boolean(se);
  };

  // Filter only completed trips with shared experiences
  const completedTripsWithExperience = useMemo(() => {
    if (!Array.isArray(trips)) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return trips.filter((trip) => {
      const end = new Date(trip.end_date);
      return end < today && hasSharedExperience(trip);
    });
  }, [trips]);

  return (
    <div className={styles.fullScreen}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/profile")}>
          ← Back
        </button>
        <h2 className={styles.pageTitle}>
          Experiences of the Completed Trips
        </h2>
      </div>

      {/* Summary */}
      <div className={styles.filterBar}>
        <span className={styles.totalTrips}>
          Total Trips: {trips?.length || 0} | Showing:{" "}
          {completedTripsWithExperience.length}
        </span>
      </div>

      {/* Table Section */}
      {completedTripsWithExperience.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Blog</th>
              <th>Rating</th>
              <th>Completed Date</th>
            </tr>
          </thead>
          <tbody>
            {completedTripsWithExperience.map((trip, index) => (
              <tr key={index}>
                <td data-label="Title">
                  {trip?.share_experiences?.title || "Untitled Trip"}
                </td>
                <td data-label="Description">
                  {trip?.share_experiences?.description || "No description"}
                </td>
                <td data-label="Blog">
                  {trip?.share_experiences?.blog ||
                    "Blog not provided for this trip"}
                </td>
                <td data-label="Rating">
                  {trip?.share_experiences?.rating || "N/A"}
                </td>
                <td data-label="Completed Date">
                  {trip?.share_experiences?.created_at
                    ? new Date(trip.share_experiences.created_at).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noData}>
          No completed trips with shared experiences found.
        </p>
      )}
    </div>
  );
};

export default TripsTable;