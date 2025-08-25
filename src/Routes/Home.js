import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Hero from "../components/HeroSection/Hero";
import heroImage from "../Assets/12.jpg";
import Destination from "../components/PopularDestination/Destination";
import Trip from "../components/RecentsTripsData/Trip";
import Footer from "../components/FooterPage/Footer";
import SearchBar from "../components/SearchBar/Searchbar";
import RMVPINKPK from "../components/RecentlyVisitorStats/RMVPINKPK";
import NearPlacesAndSeasonRec from "../components/NearPlacetoPeshawar&SWREC/NearPlacesAndSeasonRec";
import "./Home.css";


const pageVariants = {
  initial: { opacity: 0, y: 40, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

export default function Home() {
  // State to manage toast visibility
  const [showToast1, setShowToast1] = useState(false);
  const [showToast2, setShowToast2] = useState(false);

  useEffect(() => {

     // ⚠️ Arzii: ye line of code just dev phase takk hy ⚠️
     localStorage.removeItem('hasSeenPromoToasts');

    // Check if user has already seen the toasts
    const hasSeenToasts = localStorage.getItem('hasSeenPromoToasts');
    if (hasSeenToasts) {
      return; 
    }

    // Timer for the first toast (10 seconds)
    const timer1 = setTimeout(() => {
      setShowToast1(true);
    }, 10000); // 10 seconds

    // Timer for the second toast (25 seconds)
    const timer2 = setTimeout(() => {
      setShowToast2(true);
      // Set flag in localStorage as soon as the second toast is triggered
      localStorage.setItem('hasSeenPromoToasts', 'true');
    }, 25000); // 25 seconds

    // Cleanup function to clear timers if the component unmounts
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Function to close Toast 1 manually
  const closeToast1 = () => {
    setShowToast1(false);
  };

  // Function to close Toast 2 manually
  const closeToast2 = () => {
    setShowToast2(false);
  };

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      {/* Toast 1: Budget Manager */}
      {showToast1 && (
        <div className="toast toast-budget">
          <div className="toast-content">
            <p>Don't forget to manage your budget before you plan a trip!</p>
            <Link to="/budget" className="toast-link">Go to Budget Manager</Link>
          </div>
          <button className="toast-close-btn" onClick={closeToast1} aria-label="Close">
            &times;
          </button>
        </div>
      )}

      {/* Toast 2: Translator */}
      {showToast2 && (
        <div className="toast toast-translator">
          <div className="toast-content">
            <p>Are you a foreigner? Don't worry, use our translator!</p>
            <Link to="/translate" className="toast-link">Go to Translator</Link>
          </div>
          <button className="toast-close-btn" onClick={closeToast2} aria-label="Close">
            &times;
          </button>
        </div>
      )}

      <Hero
        cName="hero"
        heroImage={heroImage}
        title="Your Journey your story"
        text="Choose your favorite destination"
        buttontext="Travel Plan"
        url="/budgetmanager"
        btnclass="show"
      />
      <SearchBar />
      <Destination />
      <RMVPINKPK />
      <NearPlacesAndSeasonRec />
      <Trip />
      <Footer />
    </motion.div>
  );
}