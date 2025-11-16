import { useState, useEffect } from "react";
import styles from "./UserTrips.module.css";
import { fetchDataFromServer } from "../../../../utils/api";
import TripBudgets from "../../userBudgets/TripBudgets";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Swal from "sweetalert2";
import axios from "axios";

const UserTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, upcoming, active, completed, cancelled

  const [tripChartData, setTripChartData] = useState([]);

  const [tripChart, setTripChart] = useState([]);

  const [monthChartData, setMonthChartData] = useState([]);

  const [topDestinations, setTopDestinations] = useState([]);
  //States for budgets
  const [showTripBudgets, setShowTripBudgets] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const navigate = useNavigate();
  const onClose = () => {
    navigate(-1);
  };

  const openTripBudgets = (trip) => {
    setSelectedTrip(trip);
    setShowTripBudgets(true);
  };

  useEffect(() => {
    const fetchUserTrips = async () => {
      setLoading(true);
      setError(null);
      try {
        const host = window.location.hostname;
        const res = await fetchDataFromServer(
          `http://${host}:3001/admin/users/trips`
        );

        const tripRes = await fetchDataFromServer(
          "http://localhost:3001/admin/trips-data"
        );
        console.log("Response from /admin/users/trips → ", res.data);

        if (
          tripRes.data.tripsPerDestination &&
          tripRes.data.tripsPerDestination.length > 0
        ) {
          const chartData = tripRes.data.tripsPerDestination.map((item) => ({
            destination: item.destination,
            count: item._count.destination,
          }));
          setTripChart(chartData);

          //compute top 5
          const top5 = [...chartData]
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
          setTopDestinations(top5);
        } else {
          setTripChart([]);
        }

        const tripsArray = Array.isArray(res?.data) ? res?.data : [];

        console.log("We check trips Array ", tripsArray);

        console.log("Top destination ", topDestinations);

        // Group trips by user
        const userMap = {};
        tripsArray.forEach((trip) => {
          const user = trip?.user?.user_name || `User ${trip.user_id}`;
          const start = new Date(trip.start_date);
          const end = new Date(trip.end_date);
          const duration = (end - start) / (1000 * 60 * 60 * 24);
          console.log("We check the duration of the each ", duration);

          if (!userMap[user]) {
            userMap[user] = { totalTrips: 0, totalDuration: 0 };
          }
          userMap[user].totalTrips += 1;
          userMap[user].totalDuration += duration;
        });

        console.log("We check the user trip analytics ", userMap);

        // Convert into array for chart
        const formatted = Object.keys(userMap).map((user) => ({
          user,
          totalTrips: userMap[user].totalTrips,
          avgDuration: userMap[user].totalDuration / userMap[user].totalTrips,
        }));

        console.log("we get the trip days ", formatted);

        setTripChartData(formatted);

        const monthCount = {};
        tripsArray.forEach((trip) => {
          const month = new Date(trip.start_date).toLocaleString("default", {
            month: "long",
          });
          monthCount[month] = (monthCount[month] || 0) + 1;
        });

        const monthChartData = Object.keys(monthCount).map((month) => ({
          month,
          trips: monthCount[month],
        }));

        setMonthChartData(monthChartData);

        setTrips(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch user trips", err);
        setError("Failed to load user trips");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTrips();
  }, []);

  //delete trip function
 const deleteTrip = async (trip_id) => {
  try {
    //Show confirmation alert
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This trip will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    //If user cancels, stop here
    if (!confirm.isConfirmed) return;

    //Delete request
    const host = window.location.hostname;
    const response = await axios.delete(`http://${host}:3001/admin/trips/${trip_id}/delete-trip`)
   console.log("We delete the trip successfully ", response);
   
    //Handle response
    if (response?.data?.tripDelete) {
      Swal.fire({
        title: "Deleted!",
        text: "Trip has been deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(()=>{
        //Optional: Refresh trips list or remove deleted trip from state
        setTrips((prev) => prev.filter((trip) => trip.trip_id !== trip_id));
      });
    } else {
      Swal.fire({
        title: "Error!",
        text:
          response.message ||
          "Something went wrong while deleting the trip. Please try again.",
        icon: "error",
      });
    }
  } catch (err) {
    console.error("Error deleting trip:", err);
    Swal.fire({
      title: "Error!",
      text: "Failed to delete the trip. Please try again later.",
      icon: "error",
    });
  }
};

  //  FILTER LOGIC HELPERS
  const today = new Date();

  const isUpcoming = (trip) => {
    if (!trip.start_date) return false;
    const start = new Date(trip.start_date);
    return start > today && trip.status?.toLowerCase() !== "cancelled";
  };

  const isActive = (trip) => {
    if (!trip.start_date || !trip.end_date) return false;
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    return (
      start <= today &&
      today <= end &&
      trip.status?.toLowerCase() !== "cancelled"
    );
  };

  const isCompleted = (trip) => {
    if (!trip.end_date) return false;
    const end = new Date(trip.end_date);
    return end < today || trip.status?.toLowerCase() === "completed";
  };

  const isCancelled = (trip) => {
    return trip.status?.toLowerCase() === "cancelled" || trip.isCanceled;
  };

  //  MAIN FILTER FUNCTION

  const getFilteredTrips = () => {
    switch (filter) {
      case "upcoming":
        return trips.filter(isUpcoming);
      case "active":
        return trips.filter(isActive);
      case "completed":
        return trips.filter(isCompleted);
      case "cancelled":
        return trips.filter(isCancelled);
      default:
        return trips;
    }
  };

  const filteredTrips = getFilteredTrips();

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "—";

  const formatCurrency = (amount, currency = "PKR") =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency,
    }).format(amount || 0);

  //Budgets Render
  if (showTripBudgets) {
    return (
      <TripBudgets
        trip={selectedTrip}
        onClose={() => setShowTripBudgets(false)}
      />
    );
  }

  //  UI RENDER
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={styles.overlay}
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>Users Trips Details</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className={styles.closeButton}
          >
            ×
          </button>
        </div>
        <div className={`container ${styles.tripsAnalytics}`}>
          <div className="text-center mt-5 mb-4">
            <h2 className="fw-bold text-primary">
              🧭 Trip Analytics Dashboard
            </h2>
            <p className="text-muted">
              View user trip statistics and performance insights
            </p>
          </div>

          {/* ====== FIRST ROW ====== */}
          <div className="row justify-content-center">
            {/* Total Trips vs Average Duration */}
            <div className="col-md-6 mb-4">
              <div
                className={`card shadow-sm border-0 p-3 ${styles.chartCard}`}
              >
                <h5 className="text-center fw-semibold mb-3 text-secondary">
                  Total Trips vs Average Duration
                </h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tripChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="user" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="totalTrips"
                      fill="#0d6efd"
                      name="Total Trips"
                    />
                    <Bar
                      dataKey="avgDuration"
                      fill="#20c997"
                      name="Avg Duration (days)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trips per Destination */}
            <div className="col-md-6 mb-4">
              <div
                className={`card shadow-sm border-0 p-3 ${styles.chartCard}`}
              >
                <h5 className="text-center fw-semibold mb-3 text-secondary">
                  Trips per Destination
                </h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tripChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="destination" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#6610f2" name="Trips" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ====== SECOND ROW ====== */}
          <div className="row justify-content-center">
            {/* Most Popular Travel Months */}
            <div className="col-md-6 mb-4">
              <div
                className={`card shadow-sm border-0 p-3 ${styles.chartCard}`}
              >
                <h5 className="text-center fw-semibold mb-3 text-secondary">
                  Most Popular Travel Months
                </h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="trips" fill="#ff9800" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Destinations Pie Chart */}
            <div className="col-md-6 mb-4">
              <div
                className={`card shadow-sm border-0 p-3 ${styles.chartCard}`}
              >
                <h5 className="text-center fw-semibold mb-3 text-secondary">
                  Top Destinations
                </h5>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topDestinations}
                      dataKey="count"
                      nameKey="destination"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {topDestinations.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#0d6efd",
                              "#6610f2",
                              "#20c997",
                              "#ffc107",
                              "#dc3545",
                            ][index % 5]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {/* FILTER CONTROLS */}
          <div className={styles.controls}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Filter by status:</span>
              <div className={styles.filterButtons}>
                {["all", "upcoming", "active", "completed", "cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`${styles.filterBtn} ${
                        filter === status ? styles.filterBtnActive : ""
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className={styles.stats}>
              <span className={styles.totalTrips}>
                Total: {trips.length} trips
              </span>
              {filter !== "all" && (
                <span className={styles.filteredCount}>
                  (Showing: {filteredTrips.length})
                </span>
              )}
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              Loading trips...
            </div>
          )}

          {/* ERROR STATE */}
          {error && !loading && <div className={styles.error}>{error}</div>}

          {/* TABLE */}
          {!loading && !error && (
            <div className={styles.tableContainer}>
              <table className={styles.tripsTable}>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Trip Planned by</th>
                    <th>Trip Title</th>
                    <th>Destination</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Total Cost</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrips.map((trip, index) => (
                    <tr key={trip.trip_id}>
                      <td>{index + 1}</td>
                      <td>{trip.user?.user_name || "—"}</td>
                      <td>{trip.trip_title || "No Title"}</td>
                      <td>{trip.destination || "Unknown"}</td>
                      <td>{formatDate(trip.start_date)}</td>
                      <td>{formatDate(trip.end_date)}</td>
                      <td>
                        {trip?.budgets?.total_amount > 0 ? (
                          formatCurrency(
                            trip.budgets.total_amount,
                            trip.currency
                          )
                        ) : (
                          <span className={styles.noBudget}>
                            Budget not created
                          </span>
                        )}
                      </td>
                      <td className={styles.actionsButtons}>
                        {/* <button
                          className="btn btn-warning btn-sm"
                          // onClick={() => editTrip(trip)}
                        >
                          ✏️ Edit
                        </button> */}
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => openTripBudgets(trip)}
                        >
                          💰 Budget
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteTrip(trip.trip_id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTrips.length === 0 && !loading && (
                <div className={styles.noTrips}>
                  {filter === "all"
                    ? "No trips found for this user."
                    : `No ${filter} trips found.`}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTrips;
