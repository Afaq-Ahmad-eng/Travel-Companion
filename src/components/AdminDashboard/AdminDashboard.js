// import { useEffect, useMemo, useState } from "react";
// import { Routes, Route, Link, useNavigate } from "react-router-dom";
// import styles from "./AdminDashboard.module.css";
// import { fetchDataFromServer } from "../../utils/api";
// import EditUserModal from "./userModel/EditUserModal";
// import UserDetails from "./userDetails/UserDetails";
// import UserTrips from "./userTrips/UserTrips";
// import { putDataToServer } from "../../utils/api";
// import Swal from "sweetalert2";
// import AuthForm from "../AuthForm/AuthForm";
// import UserReport from "./userReport/UserReport";
// import axios from "axios";

// const host = window.location.hostname;

// // AdminDashboard Component
// const AdminDashboard = ({ setCloseNavBar }) => {
//   const [users, setUsers] = useState([]);
//   const [query, setQuery] = useState("");
//   // const [debouncedQuery, setDebouncedQuery] = useState(query);
//   const [loading, setLoading] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);

//   const [showAuthForm, setShowAuthForm] = useState({
//     show: false,
//     mode: "login",
//   });

//   const [showConformationMessage, setShowConformationMessage] = useState(false);

//   const navigate = useNavigate();
//   //states to show show user reports
//   const [showUserReports, setShowUserReports] = useState(false);
//   const [userId, setUserId] = useState(null);

//   //State for show full user details
//   const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);

//   //State for show user trips
//   const [selectedUserForTrips, setSelectedUserForTrips] = useState(null);

//   const handleClose = () => {
//     setCloseNavBar(false);
//     navigate("/profile"); // go back to previous page (like /profile)
//   };

//   //function for user delete
//   const handleDeleteUser = async (userId) => {
//   try {
//     // Ask for confirmation
//     const confirmResult = await Swal.fire({
//       title: "Are you sure?",
//       text: "This action will permanently delete the user.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (!confirmResult.isConfirmed) return; // exit if admin cancels

//     // Send delete request
//     const response = await axios.delete(`http://localhost:3001/admin/users/${userId}`);

//     //Remove the user locally (so we don't reload)
//     setUsers((prevUsers) => prevUsers.filter((u) => u.user_id !== userId));

//     //Show confirmation message
//     setShowConformationMessage("User has been deleted successfully ✅");

//   } catch (error) {
//     console.error("Error deleting user:", error);
//     Swal.fire({
//       icon: "error",
//       title: "Delete Failed",
//       text: error?.response?.data?.message || "Unable to delete user. Please try again later.",
//       confirmButtonColor: "#d33",
//     });
//   }
// };

//   //function for open user reports component
//   const handleViewReports = (userId) => {
//     setUserId(userId);
//     setShowUserReports(true);
//   };

//   // Function to open user details
//   const openUserDetails = (user) => {
//     setSelectedUserForDetails(user);
//   };

//   // Function to close user details
//   const closeUserDetails = () => {
//     setSelectedUserForDetails(null);
//   };

//   // Function to switch from details to edit
//   const handleEditFromDetails = (user) => {
//     setSelectedUserForDetails(null);
//     openEditor(user);
//   };

//   // function to set data for user trips
//   const openUserTrips = (user) => {
//     setSelectedUserForTrips(user);
//   };

//   // function to close user trips
//   const closeUserTrips = () => {
//     setSelectedUserForTrips(null);
//   };

//   // Debounce user search input
//   // useEffect(() => {
//   //   const handler = setTimeout(() => {
//   //     setDebouncedQuery(query);
//   //   }, 1000); // wait 300ms after typing stops

//   //   return () => {
//   //     clearTimeout(handler); // cleanup on next change
//   //   };
//   // }, [query]);

//   useEffect(() => {
//     const handleShowAuthFormAgain = (event) => {
//       const mode = event.detail?.mode || "login";
//       setShowAuthForm({ show: true, mode });
//     };
//     window.addEventListener("showAuthFormAgain", handleShowAuthFormAgain);
//     return () => {
//       window.removeEventListener("showAuthFormAgain", handleShowAuthFormAgain);
//     };
//   }, []);

// useEffect(() => {
//   if (showConformationMessage) {
//     const timer = setTimeout(() => {
//       setShowConformationMessage(false);
//     }, 5000); // hide after 5 seconds

//     return () => clearTimeout(timer);
//   }
// }, [showConformationMessage]);

//   // initial load
//   useEffect(() => {
//     let mounted = true;
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         //point to note here we are using the query param to filter users from server side(1)

//         const res = await fetchDataFromServer(
//           `http://${host}:3001/admin/users?q=${encodeURIComponent(query)}`
//         );

//         if (mounted) {
//           setUsers(
//             Array.isArray(res.data?.data) ? res.data.data : res.data || []
//           );
//         }
//       } catch (err) {
//         setError("Failed to load users");
//         Swal.fire({
//           icon: "error",
//           title: "Oops!",
//           text:
//             err?.response?.data?.message ||
//             "Unable to fetch users. Please try again later.",
//           confirmButtonText: err.response.data.TokensExpire
//             ? "Continue to log in"
//             : "Try Again",
//           confirmButtonColor: "#3085d6",
//           background: "#fff",
//           color: "#333",
//           showClass: {
//             popup: "animate__animated animate__fadeInDown",
//           },
//           hideClass: {
//             popup: "animate__animated animate__fadeOutUp",
//           },
//         }).then((result) => {
//           //Only show AuthForm when user clicks confirm
//           if (err?.response?.data?.TokensExpire && result.isConfirmed) {
//             setShowAuthForm({ show: true, mode: "login" });
//           }
//         });
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//     fetchUsers();
//     return () => (mounted = false);
//   }, [query]);

//   // realtime filtered list point no 1
//   const filteredUsers = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return users;
//     return users.filter((u) => {
//       return (
//         String(u.user_name || "")
//           .toLowerCase()
//           .includes(q) ||
//         String(u.user_email || "")
//           .toLowerCase()
//           .includes(q) ||
//         String(u.user_role || "")
//           .toLowerCase()
//           .includes(q) ||
//         String(u.user_location || "")
//           .toLowerCase()
//           .includes(q)
//       );
//     });
//   }, [users, query]);

//   const openEditor = (user) => {
//     setSelectedUser(user);
//     setEditing(true);
//     setError(null);
//   };

//   const closeEditor = () => {
//     setEditing(false);
//     setSelectedUser(null);
//     setError(null);
//   };

//   const handleSave = async (values) => {
//     setSaving(true);
//     setError(null);
//     try {
//       const res = await putDataToServer(
//         `http://${host}:3001/admin/users/${selectedUser.user_id}`,
//         values
//       );
//       const updated = res?.data || res?.data;
//       // update local list
//       setUsers((prev) =>
//         prev.map((u) =>
//           String(u.user_id) === String(updated.user_id) ? updated : u
//         )
//       );
//       closeEditor();

//     } catch (err) {
//       setError(err?.response?.data?.message || "Failed to save changes");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (showUserReports) {
//     return <UserReport userId={userId} />;
//   }

//   if (selectedUserForDetails) {
//     return (
//       <UserDetails
//         user={selectedUserForDetails}
//         onClose={closeUserDetails}
//         onEdit={handleEditFromDetails}
//       />
//     );
//   }
//   if (selectedUserForTrips) {
//     return <UserTrips user={selectedUserForTrips} onClose={closeUserTrips} />;
//   }

//   const handleLoginSuccess = () => {
//     setShowAuthForm({ show: false, mode: "login" });

//     //we use this but this is cause a full reload which we think not optimize (but work correct has we want)
//     setTimeout(() => {
//       window.location.reload(); // Force full re-render with fresh data
//     }, 100);
//   };

//   return (
//     <div className={styles.dashboardContainer}>
//       {/* <Sidebar openUserDetails={openUserDetails} /> */}
//       {!showAuthForm.show ? (
//         <>
//           <div className={styles.mainContent}>
//             <header className={styles.header}>
//               <h1>Admin Dashboard</h1>
//               <p>Welcome back, Admin 👋</p>
//               <div>
//                 <button onClick={handleClose} className={styles.closeButton}>
//                   Close
//                 </button>
//               </div>
//             </header>

//             <div className={styles.searchContainer}>
//               <div className={styles.searchBox}>
//                 <input
//                   type="search"
//                   placeholder="Search user by name, email or location..."
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   className={styles.searchInput}
//                   aria-label="Search users"
//                 />
//               </div>
//               <button
//                 onClick={() => setQuery("")}
//                 className={styles.clearButton}
//               >
//                 Clear Search
//               </button>
//             </div>

//             <div style={{ marginTop: 16 }}>
//               {loading ? (
//                 <div className={`${styles.loading} ${styles.fadeIn}`}>
//                   Loading users...
//                 </div>
//               ) : error ? (
//                 <div className={styles.error}>{error}</div>
//               ) : (
//                 <div className={`${styles.tableSection} ${styles.fadeIn}`}>
//                   <h2>Users ({filteredUsers.length})</h2>
//                   <div className={styles.tableContainer}>
//                     <table className={styles.table}>
//                       <thead>
//                         <tr>
//                           <th>Name</th>
//                           <th>Email</th>
//                           <th>Location</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredUsers.map((u) => (
//                           <tr key={u.user_id}>
//                             <td>{u.user_name || "—"}</td>
//                             <td>{u.user_email || "—"}</td>
//                             <td>{u.user_location || "—"}</td>
//                             <td>
//                               <div className={styles.actionButtons}>
//                                 <button
//                                   aria-label={`View details of ${u.user_name}`}
//                                   onClick={() => openUserDetails(u)}
//                                   title="View user details"
//                                   className={styles.viewButton}
//                                 >
//                                   👁️ View
//                                 </button>
//                                 <button
//                                   aria-label={`Edit ${u.user_name}`}
//                                   onClick={() => openEditor(u)}
//                                   title="Edit user"
//                                   className={styles.editButton}
//                                 >
//                                   ✎ Edit
//                                 </button>
//                                 <button
//                                   aria-label={`View trips of ${u.user_name}`}
//                                   onClick={() => openUserTrips(u)}
//                                   title="View user trips"
//                                   className={styles.tripsButton}
//                                 >
//                                   🛄 Trips
//                                 </button>

//                                 <button
//                                   aria-label={`View reports of ${u.user_name}`}
//                                   onClick={() => handleViewReports(u.user_id)}
//                                   title="View user trips"
//                                   className={styles.reportsButton}
//                                 >
//                                   📝 Reports
//                                 </button>
//                                 <button
//                                   aria-label={`Delete record of ${u.user_name}`}
//                                   onClick={() => handleDeleteUser(u.user_id)}
//                                   title="Delete user"
//                                   className={styles.deleteButton}
//                                 >
//                                   🗑️ Delete
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                         {filteredUsers.length === 0 && (
//                           <tr>
//                             <td colSpan="8" className={styles.noUsers}>
//                               No users match your search.
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Edit modal / side panel */}
//           {editing && selectedUser && (
//             <EditUserModal
//               selectedUser={selectedUser}
//               closeEditor={closeEditor}
//               handleSave={handleSave}
//               saving={saving}
//               error={error}
//             />
//           )}
//           {showConformationMessage && (
//             <div className={styles.topMessage}>{showConformationMessage}</div>
//           )}
//         </>
//       ) : (
//         <AuthForm
//           onClose={() => setShowAuthForm({ show: false, mode: "login" })}
//           mode={showAuthForm.mode}
//           showAuthSwitchText={false}
//           onLoginSuccess={handleLoginSuccess}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Legend,
// } from "recharts";
// import AdminDashboardSideBar from "./AdminDashboardSideBar";
// import { useEffect, useState } from "react";
// import { fetchDataFromServer } from "../../utils/api";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";

// export default function AdminDashboard(props) {
//   props.setCloseNavBar(true);

//   const navigate = useNavigate();
//   const [showAuthForm, setShowAuthForm] = useState({
//     show: false,
//     mode: "login",
//   });

//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalTrips: 0,
//     totalComplaints: 0,
//     totalResolvedComplaints: 0,
//     totalUnresolvedComplaints: 0,
//     activeUsers: 0,
//   });

//   const [userChart, setUserChart] = useState([]);
//   const [complaintChart, setComplaintChart] = useState([]);
//   const [ratingChart, setRatingChart] = useState([]);

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         const [dashRes, userRes, complaintRes] = await Promise.all([
//           fetchDataFromServer("http://localhost:3001/admin/dashboard-stats"),
//           fetchDataFromServer("http://localhost:3001/admin/users-data"),
//           fetchDataFromServer("http://localhost:3001/admin/complaints-data"),
//         ]);

//         setStats(dashRes.data);

//         // ✅ Rating Chart
//         if (dashRes?.data?.reviews && dashRes.data.reviews.length > 0) {
//           const formattedRatings = dashRes.data.reviews.map((item) => ({
//             rating: `⭐ ${item.rating}`,
//             count: item.count,
//           }));
//           setRatingChart(formattedRatings);
//         }

//         // ✅ User Chart
//         setUserChart(
//           userRes.data.length
//             ? userRes.data
//             : [
//                 { name: "Active", value: userRes.data.activeUsers || 60 },
//                 { name: "Inactive", value: userRes.data.unactiveUsers || 40 },
//               ]
//         );

//         // ✅ Complaints Chart
//         setComplaintChart(
//           complaintRes.data
//             ? [
//                 {
//                   status: "Resolved Complaints",
//                   count: complaintRes.data.resolvedComplaints || 0,
//                 },
//                 {
//                   status: "Unresolved Complaints",
//                   count: complaintRes.data.unresolvedComplaints || 0,
//                 },
//               ]
//             : []
//         );
//       } catch (error) {
//         console.error("Error fetching admin data:", error);

//         // ✅ Handle token or access issues
//         const err = error?.response?.data;
//         if (err?.TokensExpire) {
//           Swal.fire({
//             title: "Session Expired",
//             text: "Your admin session has expired. Please log in again.",
//             icon: "warning",
//             confirmButtonText: "Login",
//           }).then((res) => {
//             if (res.isConfirmed) {
//               setShowAuthForm({ show: true, mode: "login" });
//             }
//           });
//         } else if (err?.message === "Access denied. You are not an admin.") {
//           Swal.fire({
//             title: "Access Denied",
//             text: "You are not authorized to view the admin dashboard.",
//             icon: "error",
//             confirmButtonText: "Go Home",
//           }).then(() => {
//             navigate("/");
//           });
//         } else {
//           Swal.fire({
//             title: "Error",
//             text: err?.message || "Something went wrong!",
//             icon: "error",
//           });
//         }
//       }
//     };

//     fetchAllData();
//   }, [navigate]);

//   const chartCardStyle = {
//     border: "none",
//     borderRadius: "12px",
//     background: "white",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//     padding: "15px",
//     height: "320px",
//   };

//   return (
//     <div
//       className="d-flex"
//       style={{ backgroundColor: "#f5f6fa", minHeight: "100vh" }}
//     >
//       <AdminDashboardSideBar />

//       <div className="p-4 flex-grow-1">
//         <h2 className="fw-bold text-primary mb-4">Admin Dashboard</h2>

//         {/* Summary Cards */}
//         <div className="row g-4 mb-5">
//           {[
//             {
//               title: "Total Users",
//               value: stats.totalUsers,
//               color: "text-primary",
//             },
//             {
//               title: "Active Users",
//               value: stats.activeUsers,
//               color: "text-success",
//             },
//             {
//               title: "Total Revenue",
//               value: new Intl.NumberFormat("en-PK", {
//                 style: "currency",
//                 currency: "PKR",
//                 minimumFractionDigits: 4,
//                 maximumFractionDigits: 4,
//               }).format(stats.totalRevenue || 0), // Handle null/undefined
//               color: "text-warning",
//             },
//             {
//               title: "Our Profit",
//               value: new Intl.NumberFormat("en-PK", {
//                 style: "currency",
//                 currency: "PKR",
//                 minimumFractionDigits: 4,
//                 maximumFractionDigits: 4,
//               }).format((stats.totalRevenue || 0) * 0.02), // Calculate 2% of total revenue
//               color: "text-success",
//             },
//             {
//               title: "Total Trips",
//               value: stats.totalTrips,
//               color: "text-info",
//             },
//             {
//               title: "Complaints",
//               value: stats.totalComplaints,
//               color: "text-danger",
//             },
//           ].map((card, i) => (
//             <div key={i} className="col-md-3">
//               <div className="card text-center p-3 shadow-sm border-0 rounded-3 bg-white">
//                 <h6 className="text-muted mb-1">{card.title}</h6>
//                 <h2 className={`fw-bold ${card.color}`}>{card.value}</h2>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Charts */}
//         <div className="charts-section">
//           <h4 className="fw-bold mb-3 text-dark">Analytics Overview</h4>
//           <div className="row g-4">
//             {/* User Activity Pie */}
//             <div className="col-md-4">
//               <div style={chartCardStyle}>
//                 <h6 className="text-center text-secondary fw-semibold mb-2">
//                   User Activity
//                 </h6>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie
//                       data={userChart}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={80}
//                       label
//                     >
//                       {userChart.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={index === 0 ? "#28a745" : "#dc3545"}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Trips per Destination
//             <div className="col-md-4">
//               <div style={chartCardStyle}>
//                 <h6 className="text-center text-secondary fw-semibold mb-2">
//                   Trips per Destination
//                 </h6>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <BarChart data={tripChart}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="destination" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="count" fill="#007bff" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div> */}

//             {/* Complaints per User */}
//             {/* <div className="col-md-4">
//               <div style={chartCardStyle}>
//                 <h6 className="text-center text-secondary fw-semibold mb-2">
//                   Complaints per User
//                 </h6>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <BarChart data={complaintChart}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="user" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="complaints" fill="#ff6b6b" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//            */}
//             <div className="col-md-4">
//               <div style={chartCardStyle}>
//                 <h6 className="text-center text-secondary fw-semibold mb-2">
//                   Complaints (Resolved vs Unresolved)
//                 </h6>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <BarChart data={complaintChart}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="status" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="count" fill="#ff6b6b" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="col-md-4">
//               <div style={chartCardStyle}>
//                 <h6 className="text-center text-secondary fw-semibold mb-2">
//                   Ratings Distribution
//                 </h6>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <BarChart data={ratingChart}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="rating" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="count" fill="#ffc107" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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

export default function AdminDashboard(props) {
  props.setCloseNavBar(true);

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
            text: "Your admin session has expired. Please log in again.",
            icon: "warning",
            confirmButtonText: "Login",
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
        onLoginSuccess={() => setRefetchData((prev) => !prev)}
      />
    )
  );
}
