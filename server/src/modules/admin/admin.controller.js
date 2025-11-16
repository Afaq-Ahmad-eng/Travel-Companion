import * as adminService from "./admin.service.js";
import { AppError } from "../../utils/AppError.js";
import { decryptData } from "../../utils/secure.js";

/**
 * Controller: listUsers
 * Query params:
 *  - q (optional) : search string (name/email/role)
 *  - page (optional): page number (1-based)
 *  - limit (optional): items per page
 *
 * Expects adminService.listUsers({ search, offset, limit }) to return:
 *  { data: [...users], total: number }  OR an array of users (fallback)
 */
export const listUsers = async (req, res) => {
  console.log("We are admin (backend) and in the listUser function ", req.user);
  console.log(
    "We are admin (backend) and in the listUser function and we print the query ",
    req.query
  );

  try {
    const { q = "", page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(Number(page) || 1, 1);
    const perPage = Math.max(Number(limit) || 50, 1);
    const offset = (pageNum - 1) * perPage;

    // Prefer service-side filtering/pagination
    if (typeof adminService.listUsers === "function") {
      const result = await adminService.listUsers({
        search: q.trim(),
        offset,
        limit: perPage,
      });
      // result may be { data, total } or an array
      if (Array.isArray(result)) {
        return res
          .status(200)
          .json({ success: true, data: result, total: result.length });
      }
      const {
        data = [],
        total = Array.isArray(result.data) ? result.data.length : 0,
      } = result || {};
      return res
        .status(200)
        .json({ success: true, data, total, page: pageNum, limit: perPage });
    }

    // Fallback: get all users and filter in-controller
    const all = (await adminService.getAllUsers()) || [];
    const qLower = q.trim().toLowerCase();
    const filtered = qLower
      ? all.filter((u) =>
          [u.user_name, u.user_email, u.user_role]
            .join(" ")
            .toLowerCase()
            .includes(qLower)
        )
      : all;
    const paged = filtered.slice(offset, offset + perPage);

    
    const totalTripsOfAUser =
      typeof adminService.getTotalTripsOfAUser === "function"
        ? await adminService.getTotalTripsOfAUser()
        : null;

        const userTrips = totalTripsOfAUser.map(item => ({
        user_id: item.user_id,
        total_trips: item._count.trip_id
    }));
    console.log("The total trips of a user are ", userTrips);
    paged.forEach(user => {
      const tripData = userTrips.find(ut => ut.user_id === user.user_id);
      user.total_trips = tripData ? tripData.total_trips : 0;
    });

    return res
      .status(200)
      .json({
        success: true,
        data: paged,
        total: filtered.length,
        page: pageNum,
        limit: perPage,
      });
  } catch (err) {
    console.error("listUsers error:", err);
    if (err instanceof AppError) {
      next(err);
    } else {
      next(new AppError("Failed to list users.", 500));
    }
  }
};

// Controller: getUsersTrips
// Route: GET /admin/users/:user_id/trips
export const getUsersTrips = async (req, res) => {
  try {
    const user =
      typeof adminService.getUsersTripsData === "function"
        ? await adminService.getUsersTripsData()
        : null;
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("getUser error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch user." });
  }
};

/**
 * Controller: updateUser
 * Route: PUT /admin/users/:id
 * Body: only allowed fields will be applied
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    // whitelist fields that admin can update
    const allowed = [
      "user_name",
      "user_email",
      "user_location",
      "user_password",
      "user_status",
      "user_phoneno",
    ];
    const payload = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        payload[key] = req.body[key];
      }
    }

    if (Object.keys(payload).length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No valid fields provided for update.",
        });
    }

    // Use service to update; expect updated user returned
    if (typeof adminService.updateUserById === "function") {
      try {
        const updated = await adminService.updateUserById(Number(id), payload);
        if (!updated)
          return res
            .status(404)
            .json({ success: false, message: "User not found." });
        return res.status(200).json({ success: true, data: updated });
      } catch (err) {
          next(err);
      }
    }

    // Fallback: try generic updateUser
    if (typeof adminService.updateUser === "function") {
      const updated = await adminService.updateUser(Number(id), payload);
      if (!updated)
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      return res.status(200).json({ success: true, data: updated });
    }

    return res
      .status(500)
      .json({ success: false, message: "Update service not implemented." });
  } catch (err) {
    if (err) {
      next(err);
    }
  }
};

//controller for budget data

export const userBudgetData = async (req, res) => {
  try{
  const tripId = parseInt(req.params.trip_id);
  const response = await adminService.userBudgetData(tripId);
  res.status(200).json({
    message: "We are reached to the budget endpoint successfully",
    data: response
  });
}catch(userBudgetError){
  console.error(userBudgetError);
}
};

//controller for a specific category expenses 
export const specificCategoryExpenses = async (req, res, next)=> {
  try{
    const category_id = req.params.category_id;
    console.log("we get the category id ", category_id);
    
    const response = await adminService.specificCategoryExpenses(category_id);

    res.status(200).json({
      message: "Successfully get the Expenses of the specific category ",
      data: response
    })

  }catch(specificCategoryExpensesError){
    console.log(specificCategoryExpensesError);
  }
}

//controller for to delete the trip 
export const tripDelete = async (req,res,next) => {
  try{
         const response = await adminService.tripDelete(Number(req?.params?.trip_id));
         res.status(200).json({
          message: "Trip deleted successfully",
          tripDelete: response
         })
  }catch(tripDeleteError){
    console.log(tripDeleteError);
  }
}

//Controller for fetching user unResolved reports
export const fetchReports = async (req, res, next) => {
  try {
    // Fetch all complaints of this user
    let userComplaintsResponse =
      await adminService.fetchUnresolvedUserReports();

    // Decrypt each complaint’s file URL safely
    userComplaintsResponse = userComplaintsResponse.map((complaint) => ({
      ...complaint,
      fileUrl: complaint.fileUrl ? decryptData(complaint.fileUrl) : null,
    }));

    //  Send the final result back to frontend
    res.status(200).json({
      success: true,
      message: "We reached successfully to the fetchReports endpoint.",
      userComplaintsData: userComplaintsResponse,
    });
  } catch (fetchReportsError) {
    console.error("Error in fetchReports:", fetchReportsError);

    if (fetchReportsError instanceof AppError) {
      next(fetchReportsError);
    } else {
      next(new AppError("Something went wrong while fetching reports.", 500));
    }
  }
};

//Controller for user report resolved

export const userReportResolved = async (req, res, next) => {
  console.log(
    "we are at user report resolved controller ",
    req.params.reportId
  );
  const userReportResolved = await adminService.userReportsResloved(
    Number(req.params.reportId)
  );

  res.status(200).json({
    message: "we are reached to the user Report Resolved endpoint ",
  });
};

/**
 * Controller: deleteUser (optional)
 * Route: DELETE /admin/users/:id
 */
export const deleteUser = async (req, res) => {
  console.log("We are at the delete user controller ", req.params);

  try {
    const { id } = req.params;
    if (typeof adminService.deleteUserById === "function") {
      const ok = await adminService.deleteUserById(Number(id));
      if (!ok)
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      return res.status(200).json({ success: true, message: "User deleted." });
    }
    return res
      .status(500)
      .json({ success: false, message: "Delete service not implemented." });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete user." });
  }
};

export const adminLogout = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    await adminService.deleteAdminRefreshToken(adminId);
    res
      .status(200)
      .json({ success: true, message: "Admin logged out successfully." });
  } catch (error) {
    console.log("Error during admin logout: ", error);
    next(new AppError("Failed to log out admin.", 500));
  }
};

//controller for fetching admin dashboard data
export const fetchAdminDashboardData = async (req, res, next) => {
  console.log("We are at fetch admin dashboard data controller ");
  try {
    const dashboardData = await adminService.getAdminDashboardData();
    res.status(200).json({
      success: true,
      message: "Admin dashboard data fetched successfully.",
      data: dashboardData,
    });
  } catch (error) {
    console.log("Error fetching admin dashboard data:", error);
    next(new AppError("Failed to fetch admin dashboard data.", 500));
  }
};

//users data for admin dashboard
export const UsersDataForAdminDashboard = async (req, res, next) => {
  console.log("We are at users data for admin dashboard controller");
  try {
    const usersData = await adminService.getAllUsersData();
    if (!usersData) {
      return res
        .status(404)
        .json({ success: false, message: "No users found." });
    }
    return res.status(200).json({ success: true, data: usersData });
  } catch (err) {
    console.error("updateUserStatus error:", err);
    next(new AppError("Failed to update user status.", 500));
  }
};

//controller for trip data for admin dashboard
export const TripDataForAdminDashboard = async (req, res, next) => {
  console.log("We are at trip data for admin dashboard controller");
  try {
    const tripData = await adminService.getAllTripsData();
    if (!tripData) {
      return res
        .status(404)
        .json({ success: false, message: "No trip data found." });
    }
    return res.status(200).json({ success: true, data: tripData });
  } catch (err) {
    console.error("TripDataForAdminDashboard error:", err);
    next(new AppError("Failed to fetch trip data.", 500));
  }
};

//controller for complaints data for admin dashboard
export const ComplaintsDataForAdminDashboard = async (req, res, next) => {
  console.log("We are at complaints data for admin dashboard controller");
  try {
    const complaintsData = await adminService.getAllResolvedComplaintsData();
    if (!complaintsData) {
      return res
        .status(404)
        .json({ success: false, message: "No complaints data found." });
    }
    return res.status(200).json({ success: true, data: complaintsData });
  } catch (err) {
    console.error("ComplaintsDataForAdminDashboard error:", err);
    next(new AppError("Failed to fetch complaints data.", 500));
  }
};

//controller to find the total complaints
export const TotalComplaintsDataForAdminDashboard = async (req, res, next) => {
  console.log("We are at total complaints data for admin dashboard controller");
  try {
    const totalComplaintsData = await adminService.getTotalComplaintsData();
    if (!totalComplaintsData) {
      return res
        .status(404)
        .json({ success: false, message: "No complaints data found." });
    }
    return res.status(200).json({ success: true, data: totalComplaintsData });
  } catch (err) {
    console.error("TotalComplaintsDataForAdminDashboard error:", err);
    next(new AppError("Failed to fetch total complaints data.", 500));
  }
};

//controller for revenue data for admin dashboard
export const RevenueDataForAdminDashboard = async (req, res, next) => {
  console.log("We are at revenue data for admin dashboard controller");
  try {
    const revenueData = await adminService.getRevenueData();
    if (!revenueData) {
      return res
        .status(404)
        .json({ success: false, message: "No revenue data found." });
    }
    return res.status(200).json({ success: true, data: revenueData });
  } catch (err) {
    console.error("RevenueDataForAdminDashboard error:", err);
    next(new AppError("Failed to fetch revenue data.", 500));
  }
};


//controller for the share experience
export const shareExperienceData = async (req,res, next)=>{
  try{
    const response = await adminService.dataForExperience();
    res.status(200).json({
      message:"We fetch the Experience data",
      data: response
    })
  }catch(error){
    console.log(error);
  }
}