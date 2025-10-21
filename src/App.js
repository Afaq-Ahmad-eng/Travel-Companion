//External modules

import Swal from 'sweetalert2';

import { Routes, Route, useLocation,useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; 
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Navbar from './components/NavBarSection/Navbar';
import About from './Routes/About';
import Contact from './Routes/Contact';
import Home from './Routes/Home';
import Services from './Routes/Services';
import Signup from './Routes/Signup';
import BudgetManager from './components/BudgetManager/BudgetManager';
import ExperienceForm from './components/ShareYourExperience/ExperienceForm';
import Phrasebook from './components/PhraseBook/Phrasebook';
import Profile from './Routes/Profile/Profile';
import AdminDashboard from './Routes/AdminDashboard/AdminDashboard';
import DestinationDetail from './components/SearchBar/DestinationDetail';
import { useEffect, useState } from 'react';
import {fetchDataFromServer} from './utils/api.js'

const apiForBudgetManagerStatusChecker = "http://localhost:3001/budget/check";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  //state to hide the navbar on the admin panel
  const [closeNavBar, setCloseNavBar] = useState(false)

  useEffect(()=>{
    const checkBudgetManagerStatus = async () => {
      try {
        const response = await fetchDataFromServer(apiForBudgetManagerStatusChecker);
        console.log("Budget Manager Status Response:", response);

        const { showUpcomingTripAlert, mustEnterBudget, trips: { trip_id } } = response;
        console.log("Extracted Values:", { showUpcomingTripAlert, mustEnterBudget, trip_id });

        // Key for this specific trip
        const alertKey = `tripAlertShown_${trip_id}`;

         // 🔹 CASE 1: Trip starts soon → show alert only once
        // ✅ show only once before trip starts
        if (showUpcomingTripAlert && !localStorage.getItem(alertKey)) {
          await Swal.fire({
            title: "Upcoming Trip! 🌍",
            text: "Your trip starts soon — have you planned your budget?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Go and plan budget!",
            cancelButtonText: "Maybe later",
            allowOutsideClick: false, // ❌ prevent closing by clicking outside
            allowEscapeKey: false,    // ❌ prevent closing with ESC
            reverseButtons: true,     // Swap order for better UX
          }).then((result) => {
            // ✅ Mark alert as shown so it doesn’t show again
            localStorage.setItem(alertKey, "true");

            if (result.isConfirmed) {
              navigate("/budget-manager"); // go to budget page
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // stay on home page (no navigation needed)
              Swal.fire({
                title: "Got it!",
                text: "You can plan your budget anytime before your trip starts.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true
              });
            }
          });
        }
      } catch (error) {
        console.error("Error checking budget manager status:", error);
      }
    checkBudgetManagerStatus();
    }
    //we add these boolean values later to the navigate function 
  },[navigate,location]);

  const hideNavbarRoutes = ['/budget', '/share-experience', '/translate'];

  return (
    <div className="App">
      {(!hideNavbarRoutes.includes(location.pathname) && !closeNavBar)  && <Navbar />}

      {/* ✅ Wrap Routes in AnimatePresence for animation support */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/budget" element={<BudgetManager />} />
          <Route path="/share-experience" element={<ExperienceForm />} />
          <Route path="/translate" element={<Phrasebook />} />
          <Route path="/Profile" element={<Profile setCloseNavBar={setCloseNavBar}/>} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* ✅ Add Destination Detail Route - Navbar will be hidden here */}
          <Route path="/destination/:id" element={<DestinationDetail />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
