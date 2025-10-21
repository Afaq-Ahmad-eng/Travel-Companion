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
import styles from "./Profile.module.css";
// import Sidebar from "./SideBar";
import { fetchDataFromServer } from "../../utils/api";
import TripsDetails from "./tripsDetails/TripsDetails";
import PicturesGallery from "./picturesGallery/PicturesGallery";
import AuthForm from "../../components/AuthForm/AuthForm";
import Sidebar from "./SideBar";
import AdminDashboard from "../AdminDashboard/AdminDashboard";

const profileEndPoint = "http://localhost:3001/user/profile";

const Profile = ({setCloseNavBar}) => {
  const [userData, setUserData] = useState({});
  const [showTrip, setShowTrip] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [trips, setTrips] = useState([]);
  const [showAuthForm, setShowAuthForm] = useState({
    show: false,
    mode: "login",
  });

  //states to render the admin panel appropriatly
  const [adminPanel, setAdminPanel] = useState(false)
  const [userRole, setUserRole] = useState('')

  const fetchUserData = async () => {
    try {
      const user = await fetchDataFromServer(profileEndPoint);
      console.log("we are at frontend and we get user data for profile ", user.user.user_role);
      setUserRole(user.user.user_role)
      setUserData(user.user);
      try {
        setTrips(user.user?.share_experiences || []);
      } catch (err) {
        console.log("we get error due to share experiences ", err);
      }
       const alreadyWelcomed = localStorage.getItem("welcomeShown");
       (!alreadyWelcomed && user?.user?.user_name) && (
      Swal.fire({
        title: "Welcome Back!",
        text: `We are glad to see you again, ${user.user.user_name}!`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      }).then(()=>{
        localStorage.setItem("welcomeShown", "true");
      })
    )
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
    return <TripsDetails trips={[trips]} onBack={() => setShowTrip(false)} />;

  console.log("Check that trip data structure ", trips);

  if (showGallery)
    return (
      <PicturesGallery
        experiences={[trips]}
        onBack={() => setShowGallery(false)}
      />
    );

    if(adminPanel){
      return (
        <AdminDashboard 
        onClose={ () => setAdminPanel(false)}
        setCloseNavBar={setCloseNavBar}
        />
      )
    }

  return (
    <div className={styles.container}>
      {!showAuthForm.show ? (
        <>
          <Sidebar 
          setShowTrip={setShowTrip} 
          setShowGallery={setShowGallery}
          //Props for admin panel
          setAdminPanel={setAdminPanel}
          userRole={userRole}
          setCloseNavBar={setCloseNavBar}
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
                <p>2</p>
              </div>

              <div className={styles.card}>
                <h3>Travel Budget Used</h3>
                <p>$1,250</p>
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
    </div>
  );
};

export default Profile;
