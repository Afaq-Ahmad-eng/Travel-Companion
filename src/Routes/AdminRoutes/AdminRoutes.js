import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../../components/AdminDashboard/AdminDashboard";
import Users from "../../components/AdminDashboard/pages/userDetails/UserDetails";
import Reports from "../../components/AdminDashboard/pages/userReport/UserReport";
import ResolvedReports from "../../components/AdminDashboard/pages/userReport/resolvedReports/ResolvedReports";
import Trips from "../../components/AdminDashboard/pages/userTrips/UserTrips";
import ShareExperience from "../../components/AdminDashboard/pages/shareExperience/ShareExperience";
import AdminSettings from "../../components/AdminDashboard/adminSettings/AdminSettings";
// import EditUser from "../../components/AdminDashboard/pages/userModel/EditUserModal";

const AdminRoutes = ({ setCloseNavBar }) => {
  return (
    <Routes>
      {/* Absolute routes inside /AdminDashboard */}
      <Route path="/" element={<AdminDashboard setCloseNavBar={setCloseNavBar} />} />
      <Route path="/users" element={<Users />} />
      <Route path="/un-resolved-reports" element={<Reports />} />
      <Route path="/resolved-reports" element={<ResolvedReports />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/share-experience" element={<ShareExperience />} />
      <Route path="/settings" element={<AdminSettings />} />
      {/* <Route path="/edit-user" element={<EditUser />} /> */}
    </Routes>
  );
};

export default AdminRoutes;