import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";


export default function AdminSidebar() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  // helper to build hover style
  const baseBtnStyle = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
    width: "100%",
    textAlign: "left",
  };

  const getButtonStyle = (key) => {
    if (hovered === key) {
      return { ...baseBtnStyle, background: "#ffffff", color: "#000000" };
    }
    return { ...baseBtnStyle, background: "transparent", color: "inherit" };
  };

  const logout = async () => {
    try {
     const adminResponseFromDB = await axios.post("http://localhost:3001/admin/auth/logout");
      if (adminResponseFromDB.status === 200) {
        Swal.fire({
          title: "Logged Out",
          text: "You have been logged out successfully!",
        }).then(() => {
          navigate("/");
        });
      }
    } catch (err) {
      console.error("Logout failed", err);
      Swal.fire({
        title: "Logout Failed",
        text: "Could not log out. Try again.",
        icon: "error",
      });
    }
  };

  return (
    <div
      className="d-flex flex-column p-3 text-white vh-100 position-sticky top-0"
      style={{ width: "250px", height: "100%", background: "#2f3e46" }}
    >
      <h4 className="text-center mb-4">STC Admin</h4>

      {/* Dashboard */}
      <Link
        to="users"
        onMouseEnter={() => setHovered("users")}
        onMouseLeave={() => setHovered(null)}
        className="btn btn-outline-light mb-2"
        style={getButtonStyle("users")}
      >
        Users
      </Link>

      {/* <Link
        to="edit-user"
        onMouseEnter={() => setHovered("edit-user")}
        onMouseLeave={() => setHovered(null)}
        className="btn btn-outline-light mb-2"
        style={getButtonStyle("edit-user")}
      >
        Edit User
      </Link> */}

      <Link
        to="trips"
        className="btn btn-outline-light mb-2"
        onMouseEnter={() => setHovered("trips")}
        onMouseLeave={() => setHovered(null)}
        style={getButtonStyle("trips")}
      >
        Trips
      </Link>

      <Link
        to="un-resolved-reports"
        onMouseEnter={() => setHovered("reports")}
        onMouseLeave={() => setHovered(null)}
        className="btn btn-outline-light mb-2"
        style={getButtonStyle("reports")}
      >
        Un Resolved Reports
      </Link>

      <Link
        to="resolved-reports"
        onMouseEnter={() => setHovered("resolved-reports")}
        onMouseLeave={() => setHovered(null)}
        className="btn btn-outline-light mb-2"
        style={getButtonStyle("resolved-reports")}
      >
        Resolved Reports
      </Link>

      <Link
        to="share-experience"
        onMouseEnter={() => setHovered("share-experience")}
        onMouseLeave={() => setHovered(null)}
        className="btn btn-outline-light mb-2"
        style={getButtonStyle("share-experience")}
      >
        Shared Experience
      </Link>

      <Link
        to={'settings'}
        className="btn btn-outline-light mb-2"
        onMouseEnter={() => setHovered("settings")}
        onMouseLeave={() => setHovered(null)}
        style={getButtonStyle("settings")}
      >
        Setting
      </Link>

      <button className="btn btn-danger mt-auto" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
