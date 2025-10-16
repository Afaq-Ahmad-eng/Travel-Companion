import styles from "./AdminDashboard.module.css";
import Sidebar from "./AdminDashboardSideBar";

const AdminDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, Admin 👋</p>
        </header>

        {/* ✅ Cards */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Total Users</h3>
            <p>1,245</p>
          </div>
          <div className={styles.card}>
            <h3>Active Trips</h3>
            <p>58</p>
          </div>
          <div className={styles.card}>
            <h3>Revenue</h3>
            <p>$12,300</p>
          </div>
          <div className={styles.card}>
            <h3>Support Tickets</h3>
            <p>7</p>
          </div>
        </div>

        {/* ✅ Table */}
        <div className={styles.tableSection}>
          <h2>Recent Users</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Afaq Ahmad</td>
                <td>afaq@example.com</td>
                <td>Jan 5, 2025</td>
                <td>Active</td>
              </tr>
              <tr>
                <td>Sarah Khan</td>
                <td>sarah@example.com</td>
                <td>Jan 10, 2025</td>
                <td>Active</td>
              </tr>
              <tr>
                <td>Ali Raza</td>
                <td>ali@example.com</td>
                <td>Jan 12, 2025</td>
                <td>Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
