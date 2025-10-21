// //Prisma schema to use the prisma model
// import prisma from "../../config/database.js";

// const objectForCustomError = {
//   status: 404,
//   message: "Dear user, you are not registered with us. Thank you!",
// };
// export const getUserByIdForProfile = async (user_id) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { user_id },
//       select: {
//         user_name: true,
//         user_email: true,
//         user_phoneno: true,
//         user_interest: true,
//         user_location: true,
//         user_status: true,
//         user_role: true,

//         share_experiences: {
//           select: {
//             experience_id: true,
//             title: true,
//             description: true,
//             blog: true,
//             rating: true,
//             created_at: true,
//             updated_at: true,

//             experience_images: {
//               select: {
//                 id: true,
//                 image_url: true,
//               },
//             },
//           },
//         },
//         budgets:{
//           select:{
//            total_amount: true,
//            categories:{
//             select:{
//               category_name: true,
//               allocated_amount: true,
//               expenses:{
//                 select:{
//                   description: true,
//                   amount: true,
//                   expense_date: true
//                 },
//               },
//             },
//            },
//           },
//         },
//          _count: {
//       select: { share_experiences: true }, // count related experiences
//     },
//       },
//     });
      
//     console.log("We get user data ",user);
    
//     if (!user) throw objectForCustomError;


//     // Let Prisma count only that user's images
//     const totalImages = await prisma.experience_images.count({
//       where: {
//        share_experiences: {
//           user_id: user_id, //ensures we count only this user's images
//         },
//       },
//     });

// return {
//   ...user,
//   _count:{
//     ...user._count,
//     total_images: totalImages
//   }
// };
//   } catch (error) {
//     //We set our custom error codes at the top, and if any error occurs, we use the corresponding error object. However, it’s better to use the actual error that comes from the real cause and show that message to the user.
//      console.error("Error fetching user data:", error);
//     throw objectForCustomError;
//   }
// };

import prisma from "../../config/database.js";

const objectForCustomError = {
  status: 404,
  message: "Dear user, you are not registered with us. Thank you!",
};

export const getUserByIdForProfile = async (user_id) => {
  try {
    //  Fetch user with all nested relationships
    const user = await prisma.user.findUnique({
      where: { user_id },
      select: {
        user_id: true,
        user_name: true,
        user_email: true,
        user_phoneno: true,
        user_interest: true,
        user_location: true,
        user_status: true,
        user_role: true,
        user_joined: true,
        user_updatedAt: true,

        //  Include all trips ordered by latest first
        trips: {
          orderBy: { created_at: "desc" },
          include: {
            // Trip Interests → Interest Areas
            trip_interests: {
              include: {
                interest_areas: {
                  select: {
                    interest_id: true,
                    interest_name: true,
                  },
                },
              },
            },

            //  Budgets → Categories → Expenses
            budgets: {
              include: {
                categories: {
                  include: {
                    expenses: true,
                  },
                },
              },
            },

            // Share Experience → Experience Images
            share_experiences: {
              include: {
                experience_images: true,
              },
            },
          },
        },
      },
    });

    //  If no user found
    if (!user) throw objectForCustomError;

    //  Latest trip = first in sorted list (created_at DESC)
    const latestTrip = user.trips.length > 0 ? user.trips[0] : null;

    //  Total image count for all experiences of this user
    const totalImages = await prisma.experience_images.count({
      where: {
        share_experiences: {
          trips: {
            user_id,
          },
        },
      },
    });

    // Total experiences count (non-null only)
    const totalExperiences = user.trips.filter(
      (trip) => trip.share_experiences !== null
    ).length;

    // Return a clean structure with both latest and all trips
    return {
      user_details: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_phoneno: user.user_phoneno,
        user_interest: user.user_interest,
        user_location: user.user_location,
        user_status: user.user_status,
        user_role: user.user_role,
        user_joined: user.user_joined,
        user_updatedAt: user.user_updatedAt,
      },
      latest_trip: latestTrip, // only one (the newest)
      all_trips: user.trips,   // all trips (sorted latest first)
      _counts: {
        total_trips: user.trips.length,
        total_experiences: totalExperiences,
        total_images: totalImages,
      },
    };
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    throw objectForCustomError;
  }
};