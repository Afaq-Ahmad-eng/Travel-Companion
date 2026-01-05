import prisma from "../../config/database.js";

const objectForCustomError = {
  status: 404,
  message: "Dear user, you are not registered with us. Thank you!",
};

export const getUserByIdForProfile = async (user_id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id },
      select: {
        user_id: true,
        user_name: true,
        user_email: true,
        user_phoneno: true,
        user_location: true,
        user_status: true,
        user_joined: true,
        user_updatedAt: true,

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

            // One-to-one Budget → Categories → Expenses
            budgets: {
              include: {
                categories: {
                  include: {
                    expenses: true,
                  },
                },
              },
            },

            // One-to-one Share Experience → Experience Images
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

    const totalAmountFromFirstTripToTill = await prisma.budgets.aggregate({
      _sum: {
        total_amount: true,
      },
      where: {
        trips: {
          user_id: user_id,
        },
      },
    });

    //This function is used to fetch the trips data for the profile
    const tripsDataForUpComingAndCompletedAndCanceled = await prisma.trips.findMany({
      where: { user_id },
    });

    const today = new Date();

    const canceledTrips = tripsDataForUpComingAndCompletedAndCanceled.filter((trip) => trip.isCanceled === true).length;

    const upcomingTrips = tripsDataForUpComingAndCompletedAndCanceled.filter(
      (trip) => !trip.isCanceled && new Date(trip.start_date) > today
    ).length;

    const completedTrips = tripsDataForUpComingAndCompletedAndCanceled.filter(
      (trip) => !trip.isCanceled && new Date(trip.end_date) < today
    ).length;

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
        user_joined: user.user_joined,
        user_updatedAt: user.user_updatedAt,
      },
      latest_trip: latestTrip, // only one (the newest)
      all_trips: user.trips, // all trips (sorted latest first)
      _counts: {
        total_trips: user.trips.length,
        total_experiences: totalExperiences,
        total_images: totalImages,
        total_amount_of_all_trips:
        totalAmountFromFirstTripToTill?._sum?.total_amount,
        upcomingTrips,
        completedTrips,
        canceledTrips
      },
    };
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    throw objectForCustomError;
  }
};

export const budgetDataForProfile = async (user_id) => {
  try {
    const dataForBudgetManager = await prisma.trips.findMany({
      where: { user_id },
      include: {
        budgets: {
          include: {
            categories: {
              include: {
                expenses: true,
              },
            },
          },
        },
      },
    });
    return dataForBudgetManager;
  } catch (error) {
    console.log("Error fetching budget manager data for profile:", error);
  }
};

//Trips plans fecting from Db and sending to the backend and from backend send to the frontend in the prepare form
export const DataForTripPlans = async (user_id) => {
 try {
    const tripPlansData = await prisma.trips.findMany({
      where: { user_id },
    });
    return tripPlansData;
  } catch (DataForTripPlans) {}
};

export const tripPlanCancelService = async (tripId) => {
  try {
    const setDataForDB = await prisma.trips.update({
      where: { trip_id: tripId },
      data: { isCanceled: true },
    });
    return setDataForDB;
  } catch (tripPlanCancelServiceError) {
    console.log(tripPlanCancelServiceError);
  }
};
export const userProfileLogOut = async (user_id) => {
  try {
    await prisma.user_refresh_token.delete({
      where: { user_id },
    });
  } catch (userProfileLogOutError) {
    console.log("We get error during the logout ", userProfileLogOutError);
  }
};
