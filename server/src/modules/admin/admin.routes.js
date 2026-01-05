import express from "express";
import {
    listUsers,
    getUsersTrips,
    updateUser,
    fetchReports,
    deleteUser,
    userBudgetData,
    userReportResolved,
    adminLogout,
    fetchAdminDashboardData,
    UsersDataForAdminDashboard,
    TripDataForAdminDashboard,
    ComplaintsDataForAdminDashboard,
    RevenueDataForAdminDashboard,
    TotalComplaintsDataForAdminDashboard,
    specificCategoryExpenses,
    tripDelete,
    shareExperienceData,
    updateAdmin,
    updateAdminSettings
} from "./admin.controller.js";
// import { validateUpdateUser } from "./admin.validator.js";

// import { requireAdmin } from "../../middleware/auth.js"; // uncomment if you have auth middleware

const router = express.Router();

//admin dashboard data
router.get('/dashboard-stats',fetchAdminDashboardData)

//users data for admin dashboard
router.get('/users-data',UsersDataForAdminDashboard)

//Trips data for admin dashboard
router.get('/trips-data',TripDataForAdminDashboard)

//resolved complaints data for admin dashboard
router.get('/resolved/complaints-data',ComplaintsDataForAdminDashboard)

//total complaints data for admin dashboard
router.get('/complaints-data', TotalComplaintsDataForAdminDashboard);

//Revenue data for admin dashboard
router.get('/revenue-data',RevenueDataForAdminDashboard);

//admin logout route
router.post("/auth/logout", adminLogout);

// List users with optional ?q=&page=&limit=
router.get("/users", /* requireAdmin, */ listUsers);

// Get single user
router.get("/users/trips", /* requireAdmin, */ getUsersTrips);

// Update user (validate body with admin.validator.js)
router.put("/users/:id", /* requireAdmin, validateUpdateUser, */  updateUser);

//User UnResolved Reports data 
router.get("/un-resolved/complaints",fetchReports);

//User Report is Resolved 
router.put('/:reportId/Resolved',userReportResolved)

//share experience data 
router.get('/user-experiences',shareExperienceData)


//budget data 
router.get("/trips/:trip_id/budget",userBudgetData)
router.get('/categories/:category_id/expnenses',specificCategoryExpenses)

//update admin data
router.get('/admin-data-for-update', updateAdmin)

//admin update route
router.put('/update/:admin_id', updateAdminSettings)
//delete trip 
router.delete('/trips/:trip_id/delete-trip', tripDelete)
// Delete user
router.delete("/users/:id", /* requireAdmin, */ deleteUser);

export default router;