import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./TripsPlan.module.css";

const TripsPlan = ({ tripsPlanData }) => {
  const [allTrips, setAllTrips] = useState([]);
  const [filter, setFilter] = useState("UPCOMING");
  const [loading, setLoading] = useState(false);

  // Assign tripsPlanData to state
  useEffect(() => {
    if (tripsPlanData && Array.isArray(tripsPlanData)) {
      setAllTrips(tripsPlanData);
    }
  }, [tripsPlanData]);

  // Filter trips based on selected filter
  const filteredTrips = useMemo(() => {
  if (!Array.isArray(allTrips)) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return allTrips.filter((trip) => {
    if (!trip.rawStart || !trip.rawEnd) return false;

    const start = new Date(trip.rawStart);
    const end = new Date(trip.rawEnd);

    // Normalize start/end to ignore time
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    switch (filter) {
      case "UPCOMING":
        return !trip.isCanceled && start > today;
      case "ACTIVE":
        console.log("we check active trips ", !trip.isCanceled);
        return !trip.isCanceled && start <= today && end >= today;
      case "COMPLETED":
        return !trip.isCanceled && end < today;
      case "CANCELED":
        return trip.isCanceled;
      default:
        return true;
    }
  });
}, [allTrips, filter]);

  // Cancel trip handler
  const handleCancelTrip = async (tripId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this trip?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.put(
          `http://localhost:3001/user/trip/cancel/${tripId}`
        );

        Swal.fire({
          title: "Canceled!",
          text: res.data.message,
          icon: "success",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        setAllTrips((prev) =>
          prev.map((trip) =>
            trip.tripId === tripId
              ? { ...trip, isCanceled: true, tripStatus: "CANCELED" }
              : trip
          )
        );
      } catch (err) {
        Swal.fire("Error!", "Failed to cancel trip.", "error");
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.tripsContainer}>
        <div className={styles.loading}>Loading trips...</div>
      </div>
    );
  }

  return (
    <div className={styles.tripsContainer}>
      <h2 className={styles.heading}>My Trip Plans</h2>

      {/* Filter Buttons */}
      <div className={styles.filterButtons}>
        {["UPCOMING", "ACTIVE", "COMPLETED", "CANCELED"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`${styles.filterButton} ${
              filter === type ? styles.active : ""
            }`}
          >
            {type.charAt(0) + type.slice(1).toLowerCase()} Trips
          </button>
        ))}
      </div>

      {/* Debug info */}
      <div style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
        Total trips: {allTrips.length} | Filtered: {filteredTrips.length} | Current
        filter: {filter}
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Trip Title</th>
              <th>Destination</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip, index) => {
                const start = new Date(trip.rawStart);
                const end = new Date(trip.rawEnd);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let action;
                if (trip.isCanceled) {
                  action = "Canceled";
                } else if (end < today) {
                  action = "Completed";
                } else {
                  action = (
                    <button
                      onClick={() => handleCancelTrip(trip.tripId)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  );
                }
                return (
                  <tr key={trip.tripId || index}>
                    <td>{index + 1}</td>
                    <td>{trip.tripTitle || "Untitled Trip"}</td>
                    <td>{trip.destination}</td>
                    <td>{trip.startDate || "N/A"}</td>
                    <td>{trip.endDate || "N/A"}</td>
                    <td>{action}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="12" className={styles.noData}>
                  {allTrips.length === 0
                    ? "No trips found. Create your first trip plan!"
                    : `No ${filter.toLowerCase()} trips found.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripsPlan;