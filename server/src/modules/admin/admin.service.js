import { cache } from "react";
import { encryptData,decryptData } from "../../../../src/utils/secure.js";
import prisma from "../../config/database.js";
import { AppError } from "../../utils/AppError.js";
import { hashPassword, verifyPassword, } from "../../utils/hashing.js";


export const getAdminByEmail = async (email) => {
  return await prisma.admin.findUnique({
    where: { admin_email: email },
  });
};

//function for the creation of the admin user
export const createAdmin = async (data) => {
  return await prisma.admin.create({
    data,
  });
};

export const updateAdminUpdatedAtField = async (adminId) => {
  return await prisma.admin.update({
    where: { admin_id: adminId },
    data: { last_login: new Date() },
  });
};

export const createAdminRefreshToken = async (adminId, token) => {
  return await prisma.admin_refresh_token.upsert({
    where: { admin_id: adminId },
    update: {
      refresh_token: token,
    },
    create: {
        admin_id: adminId,
        refresh_token: token,
    },
  });
};


export const getTotalTripsOfAUser = async () => {
  try {
    const res = await prisma.trips.groupBy({
      by: ['user_id'],
      _count: { trip_id: true },
    });
    return res;
  } catch (error) {
    console.log("❌ We get error from getTotalTripsOfAUser ", error);
  }
};

export async function getAllUsers() {
  return prisma.user.findMany({ orderBy: { user_joined: "desc" } });
}

export async function getUsersTripsData() {
  // try to find by primary id first; fallback to other unique identifiers


  //but this logic will give us both the user and its trips data
    const tripsData = await prisma.trips.findMany({
    include: { 
      user: true,
      budgets: true,
     }, // optional, if you also want user info
     orderBy: { created_at: "desc" },
  });

  return tripsData;

}

// export async function updateUserById(id, updates = {},next) {
//     //  Fetch existing user
//   const existingUser = await prisma.user.findUnique({
//     where: { user_id: id },
//   });
//   if (!existingUser) throw new AppError("User not found");

//   //  Allow only specific fields
//   const allowed = [
//     "user_name",
//     "user_email",
//     "user_location",
//     "user_password",
//     "user_status",
//     "user_phoneno",
//   ];

//   let data = {};
//   for (const key of Object.keys(updates || {})) {
//     if (allowed.includes(key)) data[key] = updates[key];
//   }

//   if (Object.keys(data).length === 0) return null;

//   // Check equality before update
//   const isPasswordSame = data.user_password === existingUser.user_password;
  
//   const isPhoneNoSame = data.user_phoneno === decryptData(existingUser.user_phoneno);

//   // Filter only changed fields (smarter version)
// const updatedData = {};

// console.log("we check the the data which is come from the frontend ", data);


// for (const key in data) {
//   let newValue = data[key];
//   let oldValue = existingUser[key];

//   // Special case: decrypt phone number before comparing
//   if (key === "user_phoneno") {
//     oldValue = decryptData(existingUser.user_phoneno);
//   }

//   // Normalize strings for case-insensitive + trimmed comparison
//   if (typeof newValue === "string" && typeof oldValue === "string") {
//     console.log("");
    
//     newValue = newValue.trim();
//     oldValue = oldValue.trim();
//   }

//   // Case-insensitive comparison for name, email, location
//   if (["user_name", "user_email", "user_location"].includes(key)) {
//     if (newValue.toLowerCase() !== oldValue.toLowerCase()) {
//       updatedData[key] = newValue;
//     }
//   } 
//   // Password: skip here (handled separately below)
//   else if (key === "user_password") {
//     continue;
//   }
//   // All other fields: direct comparison
//   else if (newValue !== oldValue) {
//     console.log(`New value ${newValue} === oldValue ${oldValue}`, newValue === oldValue);
//     updatedData[key] = newValue;
//   }
// }

// console.log("We check either password same ",updatedData);

//   // Handle password logic
//   if (!isPasswordSame) {
//     console.log("We are at the password update logic ", updatedData.user_password);
//     updatedData.user_password = await hashPassword(updatedData.user_password);
//   }else{
    
//     delete updatedData.user_password
//   }

//   //  Handle phone number logic (encrypt only if changed)
//   if (!isPhoneNoSame && updatedData.user_phoneno) {
//       updatedData.user_phoneno = encryptData(updatedData.user_phoneno);
//   } else {
//     // if phone number is same → don't include in DB update
//     delete updatedData.user_phoneno;
//   }

//   if (Object.keys(updatedData).length === 0) {
//     throw new AppError (
//      `No changes detected. User ${updates.user_name} data remains the same.`, 
//      409, null, {
//     unchanged: true, 
//     user: existingUser 
//      }
//     );
//   }


//   //  Final update
//   try {
//     const updatedUser = await prisma.user.update({
//       where: { user_id: id },
//       data: updatedData,
//     });

//     return updatedUser;
//   } catch (err) {
//     if (err?.code === "P2025") return null;
//     if(err instanceof AppError){
//          next(err)    
//     }
//   }
// }

export const userBudgetData = async (trip_id) => {
  try {
    const result = await prisma.budgets.findUnique({
      where: { trip_id },
      include: {
        categories:true,
        trips: true,
      },
    });
    console.log("We are in the user budget data function in the service ", result);
    
    return result;
  } catch (userBudgetDataError) {
    console.error("Error fetching user budget data:", userBudgetDataError);
    throw userBudgetDataError; // optional, in case you want to handle it outside
  }
};

export async function specificCategoryExpenses(category_id) {
  try{

    const result = await prisma.expenses.findMany({
      where: {category_id : Number(category_id)},
    })
    return result;
  }catch(specificCategoryExpensesError){
    console.log(specificCategoryExpensesError);
  }
}


export async function tripDelete(trip_id) {
  try{
    await prisma.trips.delete({
      where: {trip_id}
    })
    return true;
  }catch(error){
    console.log(error);
  }
}

export async function updateUserById(id, updates = {}, next) {
  // Fetch existing user
  const existingUser = await prisma.user.findUnique({
    where: { user_id: id },
  });
  if (!existingUser) throw new AppError("User not found");

  // Allowed fields
  const allowed = [
    "user_name",
    "user_email",
    "user_location",
    "user_password",
    "user_status",
    "user_phoneno",
  ];

  // Filter only allowed fields
  const data = {};
  for (const key of Object.keys(updates || {})) {
    if (allowed.includes(key)) data[key] = updates[key];
  }

  if (Object.keys(data).length === 0) return null;

  const updatedData = {};

  // Compare field-by-field
  for (const key in data) {
    let newValue = data[key];
    let oldValue = existingUser[key];

    if (key === "user_phoneno") {
      oldValue = decryptData(existingUser.user_phoneno);
    }

    if (typeof newValue === "string" && typeof oldValue === "string") {
      newValue = newValue.trim();
      oldValue = oldValue.trim();
    }

    if (["user_name", "user_email", "user_location"].includes(key)) {
      if (newValue.toLowerCase() !== oldValue.toLowerCase()) {
        updatedData[key] = newValue;
      }
    } else if (key !== "user_password" && newValue !== oldValue) {
      updatedData[key] = newValue;
    }
  }

  //Handle password update safely
  if (data.user_password) {
    const isPasswordSame = await verifyPassword(data.user_password, existingUser.user_password);
    if (!isPasswordSame) {
      updatedData.user_password = await hashPassword(data.user_password);
    }
  }

  // Handle phone number encryption
  const isPhoneNoSame = data.user_phoneno === decryptData(existingUser.user_phoneno);
  if (!isPhoneNoSame && updatedData.user_phoneno) {
    updatedData.user_phoneno = encryptData(updatedData.user_phoneno);
  } else {
    delete updatedData.user_phoneno;
  }

  // No changes found
  if (Object.keys(updatedData).length === 0) {
    throw new AppError(
      `No changes detected. User ${updates.user_name} data remains the same.`,
      409,
      null,
      { unchanged: true, user: existingUser }
    );
  }

  // Final update
  try {
    const updatedUser = await prisma.user.update({
      where: { user_id: id },
      data: updatedData,
    });
    return updatedUser;
  } catch (err) {
    if (err?.code === "P2025") return null;
    if (err instanceof AppError) next(err);
  }
}


//function which is we use for the user reports
export async function fetchUnresolvedUserReports() {
  try{
  const userReports = await prisma.complaint.findMany({
    where: {isResolved: false},
    include:{
      user: {
      select:{
        user_id: true,
        user_name: true,
        user_email: true
      }
    }
    }
  })

  return userReports;
}catch(fetchUserReportsError){
  next(new AppError(
    "Failed to fetch unresolved user reports.",
    500,
    fetchUserReportsError
  ));
}}

//function which is we use for the user reports is now resolved
export async function userReportsResloved(reportId){
  console.log("we are at user Reports Resolved function ", reportId);
  try{
  const userReportsResolved = await prisma.complaint.update({
    where: {id: reportId},
    data: {
      isResolved: true,
      updatedAt: new Date()
    }
  })
}catch(userReportsReslovedError){
  console.log("We get error when we updating the user Reports Resolved ",userReportsReslovedError);
}}

export async function updateUser(id, updates = {}) {
    return updateUserById(id, updates);
}

export async function deleteUserById(id) {
  try {
    await prisma.user.delete({ where: { user_id: id } });
    return true;
  } catch (err) {
    if (err?.code === "P2025") return false;
    throw err;
  }
}

export async function createUser(user = {}) {
  const data = {
    user_name: user.user_name ?? "",
    user_email: user.user_email ?? null,
    user_role: user.user_role ?? "user",
    user_status: user.user_status ?? "active",
    user_phoneno: user.user_phoneno ?? null,
    // include other fields as needed; do NOT include id if Prisma manages it
    ...user,
  };
  const created = await prisma.users.create({ data });
  return created;
}

export async function deleteAdminRefreshToken(adminId) {
  try {
    await prisma.admin_refresh_token.delete({
      where: { admin_id: adminId },
    });
    return true;
  } catch (err) {
    if (err?.code === "P2025") return false;
    throw err;
  }
};


//function for the fetching adminDashboard data
export async function getAdminDashboardData() {
  
  try {
    // Total users
    const totalUsers = await prisma.user.count();
    // Total complaints
    const totalComplaints = await prisma.complaint.count();
    // Total admins
    const totalAdmins = await prisma.admin.count();

    //Then trips
    const totalTrips = await prisma.trips.count();

    //active users
    const activeUsers = await prisma.user.count({
    where: { user_status: "active" },
  });

  const revenueData = await prisma.budgets.aggregate({
    _sum: {
      total_amount: true,
    },
  });

  //review
  const rawReviews = await prisma.share_experiences.groupBy({
  by: ['rating'],
  _count: { rating: true },
  orderBy: { rating: 'desc' } // optional
});

const reviews = rawReviews.map(r => ({
  rating: r.rating,
  count: r._count.rating
}));


    return {
      totalUsers,
      totalComplaints,
      totalAdmins,
      totalTrips,
      activeUsers,
      reviews,
      totalRevenue: revenueData._sum.total_amount || 0,
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    throw new AppError("Failed to fetch admin dashboard data.", 500);
  }
}

//function to get users data for the admin dashboard
export async function getAllUsersData() {
  const activeUsers = await prisma.user.count({
    where: { user_status: "active" },
  });
  const unactiveUsers = await prisma.user.count({
    where: { user_status: "pending" },
  });

  return { activeUsers, unactiveUsers };
}


//trip data for admin dashboard
export async function getAllTripsData() {
  const tripsPerDestination = await prisma.trips.groupBy({
    by: ['destination'],
    _count: {
      destination: true,
    },
  });
  // const completedTrips = await prisma.trips.count({
  //   where: { trip_status: "completed" },
  // });
  // const ongoingTrips = await prisma.trips.count({
  //   where: { trip_status: "ongoing" },
  // });
  // return { totalTrips, completedTrips, ongoingTrips };
  return { tripsPerDestination };
}

//function to get Resolved complaint data for admin dashboard
export async function getAllResolvedComplaintsData() {
  const resolvedComplaints = await prisma.complaint.findMany({
    where: { isResolved: true },
    include:{
      user: {
      select:{
        user_id: true,
        user_name: true,
        user_email: true
      }
    }
    }
  });
  return {  resolvedComplaints };
}


//function to get complaints data for admin dashboard
export async function getTotalComplaintsData() {
  const resolvedComplaints = await prisma.complaint.count({
    where:{ isResolved: true }
  });
  const unresolvedComplaints = await prisma.complaint.count({
    where: { isResolved: false }
  });
  return { resolvedComplaints, unresolvedComplaints };
}


//function to get revenue data for admin dashboard
export async function getRevenueData() {
  const revenueData = await prisma.budgets.aggregate({
    _sum: {
      total_amount: true,
    },
  });
  return { totalRevenue: revenueData._sum.total_amount || 0};
}

//function to get admin refresh token by admin id
export async function getAdminRefreshTokenById(adminId) {
  return await prisma.admin_refresh_token.findUnique({
    where: { admin_id: adminId },
  });
}

export async function dataForExperience() {
  try {
    return await prisma.share_experiences.findMany({
      select: {
        experience_id: true,
        title :true,
        description: true,
        trip_id : true,
        rating:true,
        trips: {
          select: {
            trip_id: true,
            destination: true,
            start_date: true,
            end_date:true,
            isCanceled:true,
            user: {
              select: {
                user_id: true,
                user_name: true,
                user_email: true
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching shared experiences:", error);
    return [];
  }
}