// middleware/checkTripCompletion.js
import prisma from "../../src/config/database.js";

const fatchedTrip = async (userId) => {
  return await prisma.trips.findFirst({
    where: { user_id: userId },
    orderBy: { end_date: "desc" },
  });
}

export const checkTripCompletion = async (req, res, next) => {
  const userId = req.user.id; 
    const latestTrip = await fatchedTrip(userId);

  if (!latestTrip) {
    return res.status(400).json({
      showNavigation: true,
      message: "No trips found for this user" });
  }

  if (new Date() < new Date(latestTrip.end_date)) {
    return res
      .status(403)
      .json({ 
        message: "You can share experience only after trip ends, Thank you!" ,
        showNavigation:true
      });
  }

  next(); 
};
