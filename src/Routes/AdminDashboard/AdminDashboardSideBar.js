import styles from "./AdminDashboardSidebar.module.css";

const AdminDashboardSidebar = (props) => {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>Admin</h2>
      <ul>
        <li className={styles.active}>Dashboard</li>
        <li>Reports</li>
      </ul>
    </div>
  );
};

export default AdminDashboardSidebar;
