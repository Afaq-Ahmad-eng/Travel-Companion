// import styles from './UserDetails.module.css';
// import { decryptData } from '../../../../utils/secure';

// const UserDetails = ({ user, onClose, onEdit }) => {
//   if (!user) return null;

//   return (
//     <div
//       role="dialog"
//       aria-modal="true"
//       className={styles.overlay}
//       onClick={onClose}
//     >
//       <div
//         className={styles.modal}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className={styles.header}>
//           <h2 className={styles.title}>{user.user_name || "Unknown User"} - Details </h2>
//           <button 
//             onClick={onClose} 
//             aria-label="Close" 
//             className={styles.closeButton}
//           >
//             ×
//           </button>
//         </div>

//         <div className={styles.content}>
//           <div className={styles.detailGrid}>
//             <div className={styles.detailItem}>
//               <label className={styles.label}>User ID</label>
//               <div className={styles.value}>{user.id || user.user_id || "—"}</div>
//             </div>

//             <div className={styles.detailItem}>
//               <label className={styles.label}>Name</label>
//               <div className={styles.value}>{user.user_name || "—"}</div>
//             </div>

//             <div className={styles.detailItem}>
//               <label className={styles.label}>Email</label>
//               <div className={styles.value}>{user.user_email || "—"}</div>
//             </div>

//             <div className={styles.detailItem}>
//               <label className={styles.label}>Phone Number</label>
//               <div className={styles.value}>{decryptData(user.user_phoneno) || "—"}</div>
//             </div>

//             <div className={styles.detailItem}>
//               <label className={styles.label}>Location</label>
//               <div className={styles.value}>{user.user_location || "—"}</div>
//             </div>

//             <div className={styles.detailItem}>
//               <label className={styles.label}>Role</label>
//               <div className={styles.value}>
//                 <span className={`${styles.badge} ${styles[user.user_role]}`}>
//                   {user.user_role || "—"}
//                 </span>
//               </div>
//             </div>

//             <div className={styles.detailItem}>
//               <label className={styles.label}>Status</label>
//               <div className={styles.value}>
//                 <span className={`${styles.badge} ${styles[user.user_status]}`}>
//                   {user.user_status || "—"}
//                 </span>
//               </div>
//             </div>

//             <div className={styles.detailItem}>
//               <label className={styles.label}>Joined Date</label>
//               <div className={styles.value}>
//                 {user.user_joined ? new Date(user.user_joined).toLocaleDateString() : "—"}
//               </div>
//             </div>

//             <div className={styles.detailItem}>
//               <label className={styles.label}>Last Login</label>
//               <div className={styles.value}>
//                 {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
//               </div>
//             </div>

//             {user.user_bio && (
//               <div className={styles.fullWidth}>
//                 <label className={styles.label}>Bio</label>
//                 <div className={styles.bioValue}>{user.user_bio}</div>
//               </div>
//             )}

//             {user.preferences && (
//               <div className={styles.fullWidth}>
//                 <label className={styles.label}>Preferences</label>
//                 <div className={styles.value}>
//                   {JSON.stringify(user.preferences, null, 2)}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className={styles.buttonGroup}>
//             <button 
//               type="button" 
//               onClick={() => onEdit(user)}
//               className={styles.editButton}
//             >
//               ✎ Edit User
//             </button>
//             <button 
//               type="button" 
//               onClick={onClose}
//               className={styles.cancelButton}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDetails;


// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "./UserDetails.module.css";
// import { fetchDataFromServer, putDataToServer } from "../../../../utils/api";
// import Swal from "sweetalert2";
// import AuthForm from "../../../../components/AuthForm/AuthForm";
// import axios from "axios";
// import UserTrips from "../userTrips/UserTrips";
// // import EditUserModal from "../../editUserModal/EditUserModal"; // ✅ Add your real path
// import UserReport from "../userReport/UserReport"; // ✅ Uncomment once file exists
// // import UserDetails from "./userDetails/UserDetails"; // ✅ Uncomment if needed

// const host = window.location.hostname;

// const UserDetails = () => {
//   const [users, setUsers] = useState([]);
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [showAuthForm, setShowAuthForm] = useState({ show: false, mode: "login" });
//   const [showConformationMessage, setShowConformationMessage] = useState(false);
//   const [showUserReports, setShowUserReports] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
//   const [selectedUserForTrips, setSelectedUserForTrips] = useState(null);

//   const navigate = useNavigate();

//   // ✅ FIX: removed undefined state (setCloseNavBar)
//   const handleClose = () => {
//     navigate(-1);
//   };

//   // ✅ Delete User
//   const handleDeleteUser = async (userId) => {
//     try {
//       const confirmResult = await Swal.fire({
//         title: "Are you sure?",
//         text: "This action will permanently delete the user.",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#d33",
//         cancelButtonColor: "#3085d6",
//         confirmButtonText: "Yes, delete it!",
//       });

//       if (!confirmResult.isConfirmed) return;

//       await axios.delete(`http://${host}:3001/admin/users/${userId}`);

//       setUsers((prevUsers) => prevUsers.filter((u) => u.user_id !== userId));
//       setShowConformationMessage("User has been deleted successfully ✅");
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Delete Failed",
//         text:
//           error?.response?.data?.message ||
//           "Unable to delete user. Please try again later.",
//         confirmButtonColor: "#d33",
//       });
//     }
//   };

//   // ✅ Handle view reports
//   const handleViewReports = (userId) => {
//     setUserId(userId);
//     setShowUserReports(true);
//   };

//   // ✅ Open / close user trips
//   const openUserTrips = (user) => setSelectedUserForTrips(user);
//   const closeUserTrips = () => setSelectedUserForTrips(null);

//   // ✅ Show AuthForm again when token expired
//   useEffect(() => {
//     const handleShowAuthFormAgain = (event) => {
//       const mode = event.detail?.mode || "login";
//       setShowAuthForm({ show: true, mode });
//     };
//     window.addEventListener("showAuthFormAgain", handleShowAuthFormAgain);
//     return () => window.removeEventListener("showAuthFormAgain", handleShowAuthFormAgain);
//   }, []);

//   // ✅ Hide confirmation message after 5s
//   useEffect(() => {
//     if (showConformationMessage) {
//       const timer = setTimeout(() => setShowConformationMessage(false), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [showConformationMessage]);

//   // ✅ Fetch users
//   useEffect(() => {
//     let mounted = true;
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         const res = await fetchDataFromServer(
//           `http://${host}:3001/admin/users?q=${encodeURIComponent(query)}`
//         );
//         if (mounted) {
//           setUsers(Array.isArray(res.data?.data) ? res.data.data : res.data || []);
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load users");
//         Swal.fire({
//           icon: "error",
//           title: "Oops!",
//           text:
//             err?.response?.data?.message ||
//             "Unable to fetch users. Please try again later.",
//           confirmButtonText: err?.response?.data?.TokensExpire
//             ? "Continue to log in"
//             : "Try Again",
//           confirmButtonColor: "#3085d6",
//         }).then((result) => {
//           if (err?.response?.data?.TokensExpire && result.isConfirmed) {
//             setShowAuthForm({ show: true, mode: "login" });
//           }
//         });
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//     fetchUsers();
//     return () => {
//       mounted = false;
//     };
//   }, [query]);

//   // ✅ Filtered user list
//   const filteredUsers = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return users;
//     return users.filter((u) =>
//       [u.user_name, u.user_email, u.user_role, u.user_location]
//         .some((field) => String(field || "").toLowerCase().includes(q))
//     );
//   }, [users, query]);

//   // ✅ Editor handlers
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
//       const updated = res?.data;
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

//   // ✅ Conditional rendering for UserTrips & UserReport
//   if (showUserReports) {
//     return <UserReport userId={userId} />; // ✅ Uncomment when component ready
//   }

//   if (selectedUserForTrips) {
//     return <UserTrips user={selectedUserForTrips} onClose={closeUserTrips} />;
//   }

//   // ✅ On login success (after token expired)
//   const handleLoginSuccess = () => {
//     setShowAuthForm({ show: false, mode: "login" });
//     setTimeout(() => {
//       window.location.reload();
//     }, 100);
//   };

//   return (
//     <div className={styles.dashboardContainer}>
//       {!showAuthForm.show ? (
//         <>
//           <div className={styles.mainContent}>
//             <header className={styles.header}>
//               <h1>User Details</h1>
//               <button onClick={handleClose} className={styles.closeButton}>
//                 Close
//               </button>
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
//               <button onClick={() => setQuery("")} className={styles.clearButton}>
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
//                           {/* <th>Email</th> */}
//                           <th>Location</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredUsers.map((u) => (
//                           <tr key={u.user_id}>
//                             <td>{u.user_name || "—"}</td>
//                             {/* <td>{u.user_email || "—"}</td> */}
//                             <td>{u.user_location || "—"}</td>
//                             <td>
//                               <div className={styles.actionButtons}>
//                                 {/* <button
//                                   onClick={() => openEditor(u)}
//                                   title="Edit user"
//                                   className={styles.editButton}
//                                 >
//                                   ✎ Edit
//                                 </button> */}
//                                 {/* <button
//                                   onClick={() => openUserTrips(u)}
//                                   title="View user trips"
//                                   className={styles.tripsButton}
//                                 >
//                                   🛄 Trips
//                                 </button> */}
//                                 <button
//                                   onClick={() => handleViewReports(u.user_id)}
//                                   title="View reports"
//                                   className={styles.reportsButton}
//                                 >
//                                   📝 Reports
//                                 </button>
//                                 <button
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
//                             <td colSpan="4" className={styles.noUsers}>
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

//           {/* ✅ Edit Modal */}
//           {/* {editing && selectedUser && (
//             <EditUserModal
//               selectedUser={selectedUser}
//               closeEditor={closeEditor}
//               handleSave={handleSave}
//               saving={saving}
//               error={error}
//             />
//           )} */}

//           {/* ✅ Success Message */}
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

// export default UserDetails;


import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDataFromServer, putDataToServer } from "../../../../utils/api";
import Swal from "sweetalert2";
import AuthForm from "../../../../components/AuthForm/AuthForm";
import axios from "axios";
import UserTrips from "../userTrips/UserTrips";
import UserReport from "../userReport/UserReport";
import EditUser from "../../userModel/EditUserModal";

const host = window.location.hostname;

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState({ show: false, mode: "login" });
  const [showConformationMessage, setShowConformationMessage] = useState(false);
  const [showUserReports, setShowUserReports] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedUserForTrips, setSelectedUserForTrips] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
 

  const navigate = useNavigate();

  const handleClose = () => navigate(-1);

  const handleDeleteUser = async (userId) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "This action will permanently delete the user.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (!confirmResult.isConfirmed) return;

      await axios.delete(`http://${host}:3001/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.user_id !== userId));
      setShowConformationMessage("User has been deleted successfully ✅");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error?.response?.data?.message || "Unable to delete user.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleViewReports = (userId) => {
    setUserId(userId);
    setShowUserReports(true);
  };

  const handleSave = async (values) => {
    console.log("we are in the handle Save function ", values);
    
    try {
      const res = await putDataToServer(  
        `http://${host}:3001/admin/users/${selectedUser.user_id}`,
        values
      );
      const updated = res?.data;
      setUsers((prev) =>
        prev.map((u) =>
          String(u.user_id) === String(updated.user_id) ? updated : u
        )
      );
      setEditing(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save changes");
    }
  };

 const openEditor = (user) => {
    setSelectedUser(user);
    setEditing(true);
    setError(null);
  };

 const closeEditor = () =>{
  setEditing(false);
  setSelectedUser(null)
 }

  const openUserTrips = (user) => setSelectedUserForTrips(user);
  const closeUserTrips = () => setSelectedUserForTrips(null);

  useEffect(() => {
    const handleShowAuthFormAgain = (event) => {
      const mode = event.detail?.mode || "login";
      setShowAuthForm({ show: true, mode });
    };
    window.addEventListener("showAuthFormAgain", handleShowAuthFormAgain);
    return () => window.removeEventListener("showAuthFormAgain", handleShowAuthFormAgain);
  }, []);

  useEffect(() => {
    if (showConformationMessage) {
      const timer = setTimeout(() => setShowConformationMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConformationMessage]);

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetchDataFromServer(
          `http://${host}:3001/admin/users?q=${encodeURIComponent(query)}`
        );
        console.log("We are at frontend and in the user details ",res);
        
        if (mounted) {
          setUsers(Array.isArray(res.data?.data) ? res.data.data : res.data || []);
        }
      } catch (err) {
        setError("Failed to load users");
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text:
            err?.response?.data?.message ||
            "Unable to fetch users. Please try again later.",
          confirmButtonText: err?.response?.data?.TokensExpire
            ? "Continue to log in"
            : "Try Again",
        }).then((result) => {
          if (err?.response?.data?.TokensExpire && result.isConfirmed) {
            setShowAuthForm({ show: true, mode: "login" });
          }
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => {
      mounted = false;
    };
  }, [query]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.user_name, u.user_email, u.user_role, u.user_location]
        .some((field) => String(field || "").toLowerCase().includes(q))
    );
  }, [users, query]);

  const handleLoginSuccess = () => {
    setShowAuthForm({ show: false, mode: "login" });
    setTimeout(() => window.location.reload(), 100);
  };

  console.log("Selected user ", selectedUser);
  

  if (editing && selectedUser) {
    return (
      <EditUser
        selectedUser={selectedUser}
        handleSave={handleSave}
        saving={saving}
        error={error}
        closeEditor={closeEditor}
      />
    );
  }
  if (showUserReports) return <UserReport userId={userId} />;
  if (selectedUserForTrips) return <UserTrips user={selectedUserForTrips} onClose={closeUserTrips} />;

  return (
  <div className="container-fluid min-vh-100 bg-white py-4 px-3">
    {!showAuthForm.show ? (
      <>
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <h2 className="text-primary fw-bold mb-0">User Details</h2>
          <button onClick={handleClose} className="btn btn-outline-secondary btn-sm">
            Close
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="d-flex justify-content-center mb-4">
          <div className="input-group" style={{ maxWidth: "600px", width: "100%" }}>
            <input
              type="search"
              placeholder="Search user by name, email or location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-control"
            />
            <button onClick={() => setQuery("")} className="btn btn-outline-danger">
              Clear
            </button>
          </div>
        </div>

        {/* USER TABLE */}
        <div className="d-flex justify-content-center">
          <div className="table-responsive" style={{ width: "100%", maxWidth: "100%" }}>
            <h5 className="fw-semibold mb-3">
              Users <span className="badge bg-primary">{filteredUsers.length}</span>
            </h5>

            {loading ? (
              <div className="text-center text-muted py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2">Loading users...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center">{error}</div>
            ) : (
              <table className="table table-hover table-bordered align-middle text-center shadow-sm">
                <thead className="table-primary">
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Registration Date</th>
                    <th>Total Trips</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u, index) => (
                      <tr key={u.user_id}>
                        <td>{index + 1}</td>
                        <td>{u.user_name || "—"}</td>
                        <td>{u.user_email || "—"}</td>
                        <td>{u.user_location || "—"}</td>
                        <td>{new Date(u.user_joined).toLocaleDateString() || "—"}</td>
                        <td>{u.total_trips || 0}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* <button
                              onClick={() => handleViewReports(u.user_id)}
                              className="btn btn-sm btn-info text-white"
                            >
                              📝 Reports
                            </button> */}
                              <button
                              onClick={() => openEditor(u)}
                              className="btn btn-sm btn-info text-white"
                            >
                              Edit User
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.user_id)}
                              className="btn btn-sm btn-danger"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-muted py-3">
                        No users match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {showConformationMessage && (
          <div className="alert alert-success text-center mt-4 shadow-sm w-75 mx-auto">
            {showConformationMessage}
          </div>
        )}
      </>
    ) : (
      <AuthForm
        onClose={() => setShowAuthForm({ show: false, mode: "login" })}
        mode={showAuthForm.mode}
        showAuthSwitchText={false}
        onLoginSuccess={handleLoginSuccess}
      />
    )}
  </div>
);
};

export default UserDetails;

