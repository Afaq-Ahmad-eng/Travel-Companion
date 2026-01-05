import "bootstrap/dist/css/bootstrap.min.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import AdminDashboardSideBar from "./AdminDashboardSideBar";
import { useEffect, useState } from "react";
import { fetchDataFromServer } from "../../utils/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AuthForm from "../AuthForm/AuthForm"; // Adjust path if needed

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [showAuthForm, setShowAuthForm] = useState({
    show: false,
    mode: "login",
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrips: 0,
    totalComplaints: 0,
    totalResolvedComplaints: 0,
    totalUnresolvedComplaints: 0,
    activeUsers: 0,
  });

  const [userChart, setUserChart] = useState([]);
  const [complaintChart, setComplaintChart] = useState([]);
  const [ratingChart, setRatingChart] = useState([]);
  const [refetchData, setRefetchData] = useState(false);

  // Fetch admin dashboard data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [dashRes, userRes, complaintRes] = await Promise.all([
          fetchDataFromServer("http://localhost:3001/admin/dashboard-stats"),
          fetchDataFromServer("http://localhost:3001/admin/users-data"),
          fetchDataFromServer("http://localhost:3001/admin/complaints-data"),
        ]);

        setStats(dashRes.data);

        // Rating chart
        if (dashRes?.data?.reviews?.length > 0) {
          setRatingChart(
            dashRes.data.reviews.map((item) => ({
              rating: `⭐ ${item.rating}`,
              count: item.count,
            }))
          );
        }

        // User chart
        setUserChart(
          userRes.data.length
            ? userRes.data
            : [
                { name: "Active", value: userRes.data.activeUsers || 60 },
                { name: "Inactive", value: userRes.data.unactiveUsers || 40 },
              ]
        );

        // Complaints chart
        setComplaintChart(
          complaintRes.data
            ? [
                {
                  status: "Resolved Complaints",
                  count: complaintRes.data.resolvedComplaints || 0,
                },
                {
                  status: "Unresolved Complaints",
                  count: complaintRes.data.unresolvedComplaints || 0,
                },
              ]
            : []
        );
      } catch (error) {
        console.error("Error fetching admin data:", error);
        const err = error?.response?.data;

        if (err?.TokensExpire) {
          Swal.fire({
            title: "Session Expired",
            text: err.message || "Dear admin session has expired. Please log in again.",
            icon: "warning",
            confirmButtonText: "Login",
            allowOutsideClick: false
          }).then((res) => {
            if (res.isConfirmed) {
              setShowAuthForm({ show: true, mode: "login" });
            }
          });
        } else if (err?.message === "Access denied. You are not an admin.") {
          Swal.fire({
            title: "Access Denied",
            text: "You are not authorized to view the admin dashboard.",
            icon: "error",
            confirmButtonText: "Go Home",
          }).then(() => navigate("/"));
        } else {
          Swal.fire({
            title: "Error",
            text: err?.message || "Something went wrong!",
            icon: "error",
          });
        }
      }
    };

    fetchAllData();
  }, [navigate,refetchData]);

  useEffect(() => {
  const handleForceRefetch = () => {
    setRefetchData(prev => !prev);
  };

  window.addEventListener("forceAdminDashboardRefetch", handleForceRefetch);

  return () => {
    window.removeEventListener("forceAdminDashboardRefetch", handleForceRefetch);
  };
}, []);

  // Style for chart cards
  const chartCardStyle = {
    border: "none",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    padding: "15px",
    height: "320px",
  };

  return (
    !showAuthForm.show ? (
      <>
        <div className="d-flex" style={{ backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
          <AdminDashboardSideBar />
          <div className="p-4 flex-grow-1">
            <h2 className="fw-bold text-primary mb-4">Admin Dashboard</h2>

            {/* Summary Cards */}
            <div className="row g-4 mb-5">
              {[
                { title: "Total Users", value: stats.totalUsers, color: "text-primary" },
                { title: "Active Users", value: stats.activeUsers, color: "text-success" },
                {
                  title: "Total Revenue",
                  value: new Intl.NumberFormat("en-PK", {
                    style: "currency",
                    currency: "PKR",
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                  }).format(stats.totalRevenue || 0),
                  color: "text-warning",
                },
                {
                  title: "Our Profit",
                  value: new Intl.NumberFormat("en-PK", {
                    style: "currency",
                    currency: "PKR",
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                  }).format((stats.totalRevenue || 0) * 0.02),
                  color: "text-success",
                },
                { title: "Total Trips", value: stats.totalTrips, color: "text-info" },
                { title: "Complaints", value: stats.totalComplaints, color: "text-danger" },
              ].map((card, i) => (
                <div key={i} className="col-md-3">
                  <div className="card text-center p-3 shadow-sm border-0 rounded-3 bg-white">
                    <h6 className="text-muted mb-1">{card.title}</h6>
                    <h2 className={`fw-bold ${card.color}`}>{card.value}</h2>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="charts-section">
              <h4 className="fw-bold mb-3 text-dark">Analytics Overview</h4>
              <div className="row g-4">
                {/* User Activity */}
                <div className="col-md-4">
                  <div style={chartCardStyle}>
                    <h6 className="text-center text-secondary fw-semibold mb-2">User Activity</h6>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={userChart}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {userChart.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === 0 ? "#28a745" : "#dc3545"}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Complaints */}
                <div className="col-md-4">
                  <div style={chartCardStyle}>
                    <h6 className="text-center text-secondary fw-semibold mb-2">
                      Complaints (Resolved vs Unresolved)
                    </h6>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={complaintChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#ff6b6b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Ratings */}
                <div className="col-md-4">
                  <div style={chartCardStyle}>
                    <h6 className="text-center text-secondary fw-semibold mb-2">Ratings Distribution</h6>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={ratingChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#ffc107" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    ) : (
      <AuthForm
        mode="login"
        isAdminLogin={true}
        onClose={() => setShowAuthForm({ show: false, mode: "" })}
        onLoginSuccess={() => {
          setShowAuthForm({ show: false, mode: "" }); // Close the form
          setRefetchData((prev) => !prev); // Trigger data refetch
        }}
        showAuthSwitchText={false}
        role={'admin'}
      />
    )
  );
}
