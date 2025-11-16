import axios from "axios";
import styles from "./Sidebar.module.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SideBar = (props) => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const logoutResponse = await axios.post(
        "http://localhost:3001/user/profile/logout"
      );

      if (logoutResponse.status === 200) {
        Swal.fire({
          title: "Logged Out",
          text: "You have been logged out successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          localStorage.removeItem("budgetSaved");
          localStorage.removeItem("categories");
          localStorage.removeItem("hasSeenPromoToasts");
          localStorage.removeItem("totalBudget");
          localStorage.removeItem("welcomeShown");
          navigate("/");
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to log out. Please try again.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };
  return (
    <div className={styles.sidebar}>
      
      <ul>
        <li className={styles.active}>Profile</li>
        <li><Link to={'Trip-details'} className={styles.navLink}>My Trips</Link></li>
        <li><Link to={'My-Pictures-Gallery'} className={styles.navLink}>My Picture Gallery</Link></li>
        {props.userRole === "admin" && (
         <li
              onClick={() => {
                props.setCloseNavBar(true);
              }}
            > <Link to={"/AdminDashboard"} className={styles.navLink}>
              Admin Panel
            </Link>
            </li>
        )}
        <li><Link
        to={"/contact"}
         className={styles.navLink}
         >
          Report an Issue
        </Link>
        </li>
        <li><Link 
        to={"Budget-manager"}
        className={styles.navLink}
        >Budget Manager</Link></li>
        <li onClick={()=>{
          navigate('/share-experience')
        }}>Share Your Experience</li>
        <li><Link 
        to={'/profile/trips-plan'}
        className={styles.navLink}>Travel Plans</Link></li>
        <li onClick={handleLogOut}>Log Out</li>
      </ul>
    </div>
  );
};

export default SideBar;
