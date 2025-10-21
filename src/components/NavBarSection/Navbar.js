import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { Menuitems } from "./Menuitems";
import { FaUserPlus } from "react-icons/fa";
import AuthForm from "../AuthForm/AuthForm";

export default function Navbar() {
  const [clicked, setClicked] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
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

  // Scroll lock when modal is open
  useEffect(() => {
    document.body.style.overflow = showAuthForm ? "hidden" : "auto";
  }, [showAuthForm]);

  // Detect route (profile or admin)
  const isDarkBackgroundPage =(
    location.pathname.includes("/profile") ||
    location.pathname.includes("/admin")   ||
    location.pathname.includes("/contact") ||
    location.pathname.includes("/destination/")
  );
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
          }`}
        >
          Travel Companion
        </h1>

        <div className="menu-icons" onClick={handleClick}>
          <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        <ul className={clicked ? "nav-menu active" : "nav-menu"}>
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
            <button
              onClick={() => {
                toggleAuthForm();
                setClicked(false);
              }}
              className={`nav-links btn-link ${
                navbarScrolled || isDarkBackgroundPage ? "dark-link" : ""
              }`}
              style={{ background: "transparent", border: "none" }}
            >
              <FaUserPlus
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Sign Up
            </button>
          </li>
        </ul>
      </nav>

      {/* AuthForm modal */}
      {showAuthForm && <AuthForm onClose={toggleAuthForm} />}
    </>
  );
}
