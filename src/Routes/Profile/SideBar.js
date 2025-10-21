import styles from "./Sidebar.module.css";

const SideBar = (props) => {
  
  return (
    <div className={styles.sidebar}>
      <ul>
        <li className={styles.active}>Profile</li>
        <li
          onClick={() => props.setShowTrip(true)}
        >My Trips</li>
        <li
          onClick={() => props.setShowGallery(true)}
        >My Picture Gallery</li>
        {props.userRole === "admin" && ( <li
        onClick={ () => {
          props.setAdminPanel(true)
          props.setCloseNavBar(true)
        }}
        >Admin Panel</li>)}
        <li>Saved Destinations</li>
        <li>Travel Plans</li>
        <li>Budget Manager</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default SideBar;
