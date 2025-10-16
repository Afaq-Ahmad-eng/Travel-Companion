import styles from "./AdminDashboardSidebar.module.css";

const AdminDashboardSidebar = () => {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>Admin</h2>
      <ul>
        <li className={styles.active}>Dashboard</li>
        <li>Users</li>
        <li>Trips</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default AdminDashboardSidebar;
