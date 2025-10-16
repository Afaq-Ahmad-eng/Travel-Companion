import styles from "./Sidebar.module.css";

const SideBar = () => {
  return (
    <div className={styles.sidebar}>
      <ul>
        <li className={styles.active}>Profile</li>
        <li>My Trips</li>
        <li>Saved Destinations</li>
        <li>Travel Plans</li>
        <li>Budget Manager</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default SideBar;
