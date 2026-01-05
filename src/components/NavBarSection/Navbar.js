import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { Menuitems } from "./Menuitems";
import { FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import AuthForm from "../AuthForm/AuthForm";
import { fetchDataFromServer } from "../../utils/api";

export default function Navbar() {
  const navigate = useNavigate();
  const nav = () => {
    navigate("/");
  };
  const [clicked, setClicked] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const location = useLocation();

  const handleClick = () => setClicked(!clicked);
  const toggleAuthForm = () => setShowAuthForm(!showAuthForm);

  // Scroll navbar color change
  useEffect(() => {
    const changeNavbarColor = () => {
      setNavbarScrolled(window.scrollY >= 80);
    };
    window.addEventListener("scroll", changeNavbarColor);
    return () => window.removeEventListener("scroll", changeNavbarColor);
  }, []);

  //useEffect for sign in and logout
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const resp = await fetchDataFromServer(
          "http://localhost:3001/auth/set-sign-in-and-log-out/check"
        );
          setIsLogin(resp.loggedIn);
      } catch (error) {
       
      }
    };

    checkLogin();
  }, []);

  // Scroll lock when modal is open
  useEffect(() => {
    document.body.style.overflow = showAuthForm ? "hidden" : "auto";
  }, [showAuthForm]);

  const handleLogout = async () => {
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
          setIsLogin(logoutResponse.LoggedIn)
          navigate("/");
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to log out. Please try again.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };
  // Detect route (profile)
  const isDarkBackgroundPage =
    location.pathname.includes("/profile") ||
    location.pathname.includes("/admin") ||
    location.pathname.includes("/contact") ||
    location.pathname.includes("/budget") ||
    location.pathname.includes("/destination/");
  return (
    <>
      <nav
        className={`navbaritems ${navbarScrolled ? "scrolled" : ""} ${
          isDarkBackgroundPage ? "dark-page" : ""
        }`}
      >
        <h1
          className={`logo ${
            navbarScrolled || isDarkBackgroundPage ? "dark-logo" : ""
          } ${navbarScrolled ? "scrolled" : ""}`}
          onClick={nav}
        >
          Travel Companion
        </h1>

        <div className="menu-icons" onClick={handleClick}>
          <i
            className={`${clicked ? "fas fa-times" : "fas fa-bars"} ${
              navbarScrolled || isDarkBackgroundPage || clicked
                ? "menu-icon-white"
                : "menu-icon-black"
            }`}
          ></i>
        </div>

        <ul
          className={`${clicked ? "nav-menu active" : "nav-menu"} ${
            navbarScrolled ? "scrolled" : ""
          }`}
        >
          {Menuitems.map((item, index) => (
            <li key={index}>
              <Link
                className={`nav-links ${
                  navbarScrolled || isDarkBackgroundPage ? "dark-link" : ""
                }`}
                to={item.URL}
                onClick={() => setClicked(false)}
              >
                <i className={item.icon}></i>
                {item.title}
              </Link>
            </li>
          ))}

          <li>
            {!isLogin ? (
              <button
                onClick={() => {
                  toggleAuthForm();
                  setClicked(false);
                }}
                className={`nav-links nav-btn ${
                  navbarScrolled || isDarkBackgroundPage ? "dark-link" : ""
                }`}
              >
                <FaUserPlus
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Sign In
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className={`nav-links nav-btn ${
                  navbarScrolled || isDarkBackgroundPage ? "dark-link" : ""
                }`}
              >
                <FaSignOutAlt
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Logout
              </button>
            )}
          </li>
        </ul>
      </nav>

      {/* AuthForm modal */}
      {showAuthForm && 
      <AuthForm 
      onClose={toggleAuthForm} 
      onLoginSuccess={() => setIsLogin(true)}
      />}
    </>
  );
}
