// //External modules
// import Swal from "sweetalert2";
// //Internal modules
// import { useEffect, useState } from "react";
// import styles from "./Profile.module.css";
// import Sidebar from "./SideBar";
// import { fatchDataFromServer } from "../../utils/api";
// import TripsDetails from "./tripsDetails/TripsDetails";
// import PicturesGallery from "./picturesGallery/PicturesGallery";
// import AuthForm from "../../components/AuthForm/AuthForm";

// //endpoint for this profile
// const profileEndPoint = "http://localhost:3001/user/profile";

// const Profile = () => {
//   const [userData, setUserData] = useState({});
//   const [showTrip, setShowTrip] = useState(false);
//   const [showGallery, setShowGallery] = useState(false);
//   const [trips, setTrips] = useState([]);

//   const [showAuthForm, setShowAuthForm] = useState({
//     show: false,
//     pendingValues: null,
//   });

//   useEffect(() => {
//     const factehUserData = async () => {
//         try{
//       const user = await fatchDataFromServer(profileEndPoint);
//       console.log("we get user data for profile ", user.user);
//       setUserData(user.user);
//       setTrips(user.user?.share_experiences || []);

//     }catch(error){
//       console.log("we get error due to unauthorization and we arw at the Profile component at frontend ",error);

//       const errorMsg =
//               error?.response?.data?.message || "Unexpected error occurred.";

//             Swal.fire({
//               title: `Error during Share Experience`,
//               text: errorMsg,
//               icon: "error",
//               confirmButtonText: "Continue to Login",
//               confirmButtonColor: "#3085d6",
//               background: "#ffffff",
//               color: "#333",
//             }).then((result) => {
//               if (
//                 result.isConfirmed &&
//                 error.response?.data?.TokensExpire &&
//                 !error.response?.data?.TokensValid
//               ) {
//                 // Tokens expired → show login form
//                 setShowAuthForm({ show: true, pendingValues: values });
//               }
//             });
//     }
//       };

//     factehUserData();
//   }, []);

//   useEffect(() => {
//     const handleShowAuthFormAgain = () => {
//       setShowAuthForm({ show: true }); // reopen the AuthForm in login mode
//     };

//     window.addEventListener("showAuthFormAgain", handleShowAuthFormAgain);

//     // Cleanup the event listener on unmount
//     return () => {
//       window.removeEventListener("showAuthFormAgain", handleShowAuthFormAgain);
//     };
//   }, []);

//   // If showTrips = true, show only trips screen
//   if (showTrip) {
//     return <TripsDetails trips={trips} onBack={() => setShowTrip(false)} />;
//   }

//   // Show gallery view
//   if (showGallery) {
//     return (
//       <PicturesGallery
//         experiences={trips} // pass same trip data to use their images
//         onBack={() => setShowGallery(false)}
//       />
//     );
//   }

//   return (
//     <div className={styles.container}>
//     {!showAuthForm.show ? (
//       <>
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Profile Section */}
//       <div className={styles.profileSection}>
//         <div className={styles.header}>
//           <div className={styles.headerLeft}>
//             <div className={styles.avatar}>
//               {userData?.user_name
//                 ? userData.user_name.charAt(0).toUpperCase()
//                 : "?"}
//             </div>

//             {/* name + location + interests attached to avatar */}
//             <div>
//               <h2>{userData.user_name}</h2>
//               <p>Location: {userData.user_location}, Pakistan</p>
//               <p>Interests Area's: {userData.user_interest}</p>
//             </div>
//           </div>

//           {/* contact details (no card style now) */}
//           <div className={styles.contactSection}>
//             <h3>Contact</h3>
//             <p>
//               <strong>Email:</strong> {userData.user_email || "Not provided"}
//             </p>
//             <p>
//               <strong>Phone:</strong> {userData.user_phoneno || "Not provided"}
//             </p>
//           </div>
//         </div>

//         <div className={styles.stats}>
//           <div
//             className={styles.card}
//             onClick={() => setShowTrip(true)}
//             style={{ cursor: "pointer" }}
//           >
//             <h3>Trips Completed</h3>
//             {/* here we didn't understand on this when we use optional chaining this will get our value but if we didn't use optioanl chaining this will give us error */}
//             <p>{userData?._count}</p>
//           </div>
//           <div
//             className={styles.card}
//             onClick={() => setShowGallery(true)}
//             style={{ cursor: "pointer" }}
//           >
//             <h3>My Picture Gallery</h3>
//           </div>
//           <div className={styles.card}>
//             <h3>Upcoming Trips</h3>
//             <p>2</p>
//           </div>
//           <div className={styles.card}>
//             <h3>Travel Budget Used</h3>
//             <p>$1,250</p>
//           </div>
//         </div>
//       </div></>) :
//      (
//         <AuthForm
//           onClose={() => setShowAuthForm({ show: false, pendingValues: null })}
//           fromExperience={true}
//           source="indirect"
//           pendingValues={showAuthForm.pendingValues}
//           onLoginSuccess={async () => {
//             await handleExperienceSubmit(showAuthForm.pendingValues, {
//               setSubmitting: () => {},
//               resetForm: () => {},
//             });
//             setShowAuthForm({ show: false, pendingValues: null });
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default Profile;

import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import styles from "./Profile.module.css";
import { fetchDataFromServer } from "../../utils/api";
import TripsDetails from "./tripsDetails/TripsDetails";
import PicturesGallery from "./picturesGallery/PicturesGallery";
import AuthForm from "../../components/AuthForm/AuthForm";
import Sidebar from "./SideBar";
import BudgetManager from "./budgetManager/BudgetManager";
import TripsPlan from "./tripsPlain/TripsPlan";
import { FaBars } from "react-icons/fa"; // hamburger icon

const host = window.location.hostname;
const profileEndPoint = `http://${host}:3001/user/profile`;

//variable for to store user data object like user name, email, and id
let dataForReport = null;

const Profile = ({ setCloseNavBar }) => {
  const [userData, setUserData] = useState({});
  const [showTrip, setShowTrip] = useState(false);
  const [trips, setTrips] = useState([]);
  const [showAuthForm, setShowAuthForm] = useState({
    show: false,
    mode: "login",
  });

  const [showSidebar, setShowSidebar] = useState(false);

  const [tripsPlanData, setTripsPlanData] = useState();

  //states to render the admin panel appropriatly
  const [userRole, setUserRole] = useState("");

  const location = useLocation();

  const fetchUserData = async () => {
    try {
      console.log("We are requesting from ", host);

      const user = await fetchDataFromServer(profileEndPoint);
      console.log("we are at frontend and we get user data for profile ", user);
      dataForReport = {
        user_id: user?.user?.user_id,
        user_name: user?.user?.user_name,
        user_email: user?.user?.user_email,
      };
      console.log("We prepare data for report ", dataForReport);

      const tripsData = await fetchDataFromServer(
        `http://localhost:3001/user/profile/${dataForReport.user_id}/trips-plan-data`
      );

      console.log(
        "we are at Profile and we fetched data for the Trips plan ",
        tripsData
      );

      setTripsPlanData(tripsData?.DataForTripsPlan);
      console.log("we check user.user?.allTrips ", user.user?.allTrips);
      setUserRole(user.user.user_role);
      setUserData(user.user);
      try {
        setTrips(user.user?.allTrips || []);
      } catch (err) {
        console.log("we get error due to share experiences ", err);
      }
      const alreadyWelcomed = localStorage.getItem("welcomeShown");
      !alreadyWelcomed &&
        user?.user?.user_name &&
        Swal.fire({
          title: "Welcome Back!",
          text: `We are glad to see you again, ${user.user.user_name}!`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
        }).then(() => {
          localStorage.setItem("welcomeShown", "true");
        });
    } catch (error) {
      console.log(`Error come in profile ${error}`);

      const errorMsg =
        error?.response?.data?.message || "Unexpected error occurred.";
      setShowAuthForm({ show: false });
      Swal.fire({
        title: "Access Denied",
        icon: "warning",
        text: errorMsg,
        confirmButtonText: "Continue to Log in",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        setShowAuthForm({ show: true, mode: "login" });
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleShowAuthFormAgain = (event) => {
      const mode = event.detail?.mode || "login";
      setShowAuthForm({ show: true, mode });
    };
    window.addEventListener("showAuthFormAgain", handleShowAuthFormAgain);
    return () => {
      window.removeEventListener("showAuthFormAgain", handleShowAuthFormAgain);
    };
  }, []);

  if (showTrip)
    return <TripsDetails trips={trips} onBack={() => setShowTrip(false)} />;

  console.log("Check that trip data structure ", trips);

  const isNestedRoute = location.pathname !== "/profile";

  return (
    <div className={styles.container}>
      <Routes>
        <Route
          path="Budget-manager/*"
          element={<BudgetManager userId={dataForReport?.user_id} />}
        />
        <Route
          path="My-Pictures-Gallery"
          element={<PicturesGallery experiences={trips} />}
        />
        <Route path="/Trip-details" element={<TripsDetails trips={trips} />} />
        <Route
          path="trips-plan"
          element={
            <TripsPlan
              userId={dataForReport?.user_id}
              tripsPlanData={tripsPlanData}
            />
          }
        />
      </Routes>
      {!isNestedRoute && (
        <>
          {!showAuthForm.show ? (
            <>
              {/* Menu button visible only on small screens */}
              <button
                className={styles.menuButton}
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <FaBars />
              </button>
              <Sidebar
                className={`${styles.sidebar} ${
                  showSidebar ? styles.show : ""
                }`}
                setShowTrip={setShowTrip}
                //Props for admin panel
                userRole={userRole}
                setCloseNavBar={setCloseNavBar}
                userData={dataForReport}
              />
              <div className={styles.profileSection}>
                <div className={styles.header}>
                  <div className={styles.headerLeft}>
                    <div className={styles.avatar}>
                      {userData?.user_name
                        ? userData.user_name.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                    <div>
                      <h2>{userData.user_name}</h2>
                      <p>Location: {userData.user_location || "N/A"}</p>
                      <p>
                        Interests:{" "}
                        {Array.isArray(userData?.user_interest) &&
                        userData.user_interest.length > 0
                          ? userData.user_interest.join(", ")
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className={styles.contactSection}>
                    <h3>Contact</h3>
                    <p>
                      <strong>Email:</strong>{" "}
                      {userData.user_email || "Not provided"}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {userData.user_phoneno || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className={styles.stats}>
                  <div className={styles.card}>
                    <h3>Trips Completed</h3>
                    <p>{userData?.TotalExperiences || 0}</p>
                  </div>

                  <div className={styles.card}>
                    <h3>My Pictures</h3>
                    <p>Pictures Uploaded : {userData?.TotalImages}</p>
                  </div>

                  <div className={styles.card}>
                    <h3>Upcoming Trips</h3>
                    <p>{userData?.UpComingTrips}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Completed Trips</h3>
                    <p>{userData?.CompletedTrips}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Canceled Trips</h3>
                    <p>{userData?.CanceledTrips}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Travel Budget Used</h3>
                    <p>{userData?.TotalAmountOfAllTrips
                        ? new Intl.NumberFormat("en-PK", {
                            style: "currency",
                            currency: "PKR",
                            minimumFractionDigits: 0, 
                          }).format(userData.TotalAmountOfAllTrips)
                        : "PKR 0"}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <AuthForm
              onClose={() => setShowAuthForm({ show: false, mode: "login" })}
              mode={showAuthForm.mode}
              showAuthSwitchText={false}
              onLoginSuccess={() => {
                setShowAuthForm({ show: false, mode: "login" });
                fetchUserData(); //refetch user data after successful login
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
