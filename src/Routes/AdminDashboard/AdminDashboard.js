import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as yup from "yup";
import styles from "./AdminDashboard.module.css";
import Sidebar from "./AdminDashboardSideBar";
import { fetchDataFromServer } from "../../utils/api";
import { decryptData } from "../../utils/secure";
import EditUserModal from "./userModel/EditUserModal";
import UserDetails from "./userDetails/UserDetails";
import UserTrips from "./userTrips/UserTrips";

// Validation schema for editing user

const editSchema = yup.object({
  user_name: yup.string().required("Name is required").min(2),
  user_email: yup.string().required("Email is required").email("Invalid email"),
  user_role: yup.string().required("Role is required"),
  user_status: yup.string().required("Status is required"),
  user_phoneno: yup.string().nullable(),
});

// AdminDashboard Component
const AdminDashboard = ({onClose,setCloseNavBar}) => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  

  //State for show full user details
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);

  //State for show user trips
  const [selectedUserForTrips, setSelectedUserForTrips] = useState(null);

  // Function to open user details
  const openUserDetails = (user) => {
    setSelectedUserForDetails(user);
  };

  // Function to close user details
  const closeUserDetails = () => {
    setSelectedUserForDetails(null);
  };

  // Function to switch from details to edit
  const handleEditFromDetails = (user) => {
    setSelectedUserForDetails(null);
    openEditor(user);
  };

  // function to set data for user trips
  const openUserTrips = (user) => {
    setSelectedUserForTrips(user);
  };

  // function to close user trips
  const closeUserTrips = () => {
    setSelectedUserForTrips(null);
  };

  // initial load
  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        //point to note here we are using the query param to filter users from server side(1)
        const res = await fetchDataFromServer(
          `http://localhost:3001/admin/users?q=${encodeURIComponent(query)}`
        );
        if (mounted)
          setUsers(
            Array.isArray(res.data?.data) ? res.data.data : res.data || []
          );
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError("Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => (mounted = false);
  }, [query]);

  // realtime filtered list
  const filteredUsers = useMemo(() => {
    console.log(
      "we check that the user filter is work or not and show the query state  ",
      query
    );
    console.log(
      "we check that the user filter is work or not and show the user  ",
      users
    );
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      return (
        String(u.user_name || "")
          .toLowerCase()
          .includes(q) ||
        String(u.user_email || "")
          .toLowerCase()
          .includes(q) ||
        String(u.user_role || "")
          .toLowerCase()
          .includes(q) ||
        String(u.user_location || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [users, query]);

  const openEditor = (user) => {
    setSelectedUser(user);
    setEditing(true);
    setError(null);
  };

  const closeEditor = () => {
    setEditing(false);
    setSelectedUser(null);
    setError(null);
  };

  const handleSave = async (values) => {
    setSaving(true);
    setError(null);
    try {
      const res = await axios.put(`/admin/users/${selectedUser.id}`, values);
      const updated = res.data?.data || res.data;
      // update local list
      setUsers((prev) =>
        prev.map((u) => (String(u.id) === String(updated.id) ? updated : u))
      );
      closeEditor();
    } catch (err) {
      console.error("Update failed", err);
      setError(err?.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (selectedUserForDetails) {
    return (
      <UserDetails
        user={selectedUserForDetails}
        onClose={closeUserDetails}
        onEdit={handleEditFromDetails}
      />
    );
  }
  if (selectedUserForTrips) {
    return (
      <UserTrips
        user={selectedUserForTrips}
        onClose={closeUserTrips}
      />
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* <Sidebar openUserDetails={openUserDetails} /> */}

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, Admin 👋</p>
          <div>
            <button onClick={()=> {
              onClose()
              setCloseNavBar(false)
              }}  className={styles.closeButton}>
              Close
            </button>
          </div>
        </header>

        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <input
              type="search"
              placeholder="Search user by name, email or location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search users"
            />
          </div>
          <button onClick={() => setQuery("")} className={styles.clearButton}>
            Clear Search
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          {loading ? (
            <div className={styles.loading}>Loading users...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <div className={styles.tableSection}>
              <h2>Users ({filteredUsers.length})</h2>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id || u.user_id || u.user_email}>
                        <td>{u.user_name || "—"}</td>
                        <td>{u.user_email || "—"}</td>
                        <td>{decryptData(u.user_phoneno) || "—"}</td>
                        <td>{u.user_location || "—"}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              aria-label={`View details of ${u.user_name}`}
                              onClick={() => openUserDetails(u)}
                              title="View user details"
                              className={styles.viewButton}
                            >
                              👁️ View
                            </button>
                            <button
                              aria-label={`Edit ${u.user_name}`}
                              onClick={() => openEditor(u)}
                              title="Edit user"
                              className={styles.editButton}
                            >
                              ✎ Edit
                            </button>
                            <button
                              aria-label={`View trips of ${u.user_name}`}
                              onClick={() => openUserTrips(u)}
                              title="View user trips"
                              className={styles.tripsButton}
                            >
                              🛄 Trips
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="8" className={styles.noUsers}>
                          No users match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit modal / side panel */}
      {editing && selectedUser && (
        <EditUserModal
          selectedUser={selectedUser}
          closeEditor={closeEditor}
          handleSave={handleSave}
          saving={saving}
          error={error}
          editSchema={editSchema}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
