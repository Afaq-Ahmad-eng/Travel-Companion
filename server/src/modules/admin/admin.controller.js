import * as adminService from "./admin.service.js";

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
  console.log("We are admin (backend) and in the listUser function and we print the query ", req.query);
  
  try {
    const { q = "", page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(Number(page) || 1, 1);
    const perPage = Math.max(Number(limit) || 50, 1);
    const offset = (pageNum - 1) * perPage;

    // Prefer service-side filtering/pagination
    if (typeof adminService.listUsers === "function") {
      const result = await adminService.listUsers({ search: q.trim(), offset, limit: perPage });
      // result may be { data, total } or an array
      if (Array.isArray(result)) {
        return res.status(200).json({ success: true, data: result, total: result.length });
      }
      const { data = [], total = Array.isArray(result.data) ? result.data.length : 0 } = result || {};
      return res.status(200).json({ success: true, data, total, page: pageNum, limit: perPage });
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
    return res.status(200).json({ success: true, data: paged, total: filtered.length, page: pageNum, limit: perPage });
  } catch (err) {
    console.error("listUsers error:", err);
    return res.status(500).json({ success: false, message: "Failed to list users." });
  }
};

/**
 * Controller: getUserTrip 
 * Route: GET /admin/users/:user_id/trips
 */
export const getUserTrips = async (req, res) => {
  console.log("We are at get user Trips at Backend ", req.params);
  
  try {
    const { id } = req.params;
    console.log("User Id ", id);
    console.log("Type of User Id ", typeof Number(id));
    
    const user = typeof adminService.getUserTripsDataByUserId === "function"
      ? await adminService.getUserTripsDataByUserId(Number(id))
      : null;
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("getUser error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch user." });
  }
};

/**
 * Controller: updateUser
 * Route: PUT /admin/users/:id
 * Body: only allowed fields will be applied
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    // whitelist fields that admin can update
    const allowed = ["user_name", "user_email", "user_role", "user_status", "user_phoneno"];
    const payload = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        payload[key] = req.body[key];
      }
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields provided for update." });
    }

    // Use service to update; expect updated user returned
    if (typeof adminService.updateUserById === "function") {
      const updated = await adminService.updateUserById(id, payload);
      if (!updated) return res.status(404).json({ success: false, message: "User not found." });
      return res.status(200).json({ success: true, data: updated });
    }

    // Fallback: try generic updateUser
    if (typeof adminService.updateUser === "function") {
      const updated = await adminService.updateUser(id, payload);
      if (!updated) return res.status(404).json({ success: false, message: "User not found." });
      return res.status(200).json({ success: true, data: updated });
    }

    return res.status(500).json({ success: false, message: "Update service not implemented." });
  } catch (err) {
    console.error("updateUser error:", err);
    // if validation errors from service, propagate
    if (err.isJoi || err.details) {
      const errors = err.details ? err.details.map(d => d.message) : [err.message];
      return res.status(400).json({ success: false, errors });
    }
    return res.status(500).json({ success: false, message: "Failed to update user." });
  }
};

/**
 * Controller: deleteUser (optional)
 * Route: DELETE /admin/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (typeof adminService.deleteUserById === "function") {
      const ok = await adminService.deleteUserById(id);
      if (!ok) return res.status(404).json({ success: false, message: "User not found." });
      return res.status(200).json({ success: true, message: "User deleted." });
    }
    return res.status(500).json({ success: false, message: "Delete service not implemented." });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete user." });
  }
};

export default {
  listUsers,
  getUserTrips,
  updateUser,
  deleteUser,
};