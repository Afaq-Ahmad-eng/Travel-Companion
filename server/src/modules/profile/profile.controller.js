// Internal modules
import { decryptData } from "../../utils/secure.js";
import {
  budgetDataForProfile,
  DataForTripPlans,
  getUserByIdForProfile,
  tripPlanCancelService,
  userProfileLogOut,
} from "./profile.service.js";

//  Profile Controller
export const profile = async (req, res) => {
  const hostHeader = req.get("host"); // e.g. "example.com:3000"
  const hostname = req.hostname; // e.g. "example.com" (no port)
  const protocol = req.protocol; // "http" or "https" (trust proxy matters)
  const fullUrl = `${protocol}://${hostname}:${hostHeader}${req.originalUrl}`;
  console.log("We get request from the this url ", fullUrl);

  try {
    //  Fetch data from DB
    const response = await getUserByIdForProfile(req.user.user_id);
    console.log("User Profile Data From DB:", response);

    if (!response || !response.user_details) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please ensure you're logged in correctly.",
      });
    }

    // Decrypt experience images (if any)
    let decryptedImagesUrlsOfExperiences = [];
    try {
      const experiences = response?.latest_trip?.share_experiences;

      if (experiences?.experience_images?.length > 0) {
        decryptedImagesUrlsOfExperiences = experiences.experience_images.map(
          (img) => ({
            ...img,
            image_url: decryptData(img.image_url),
          })
        );
      } else {
        console.log(
          "No trips or experience images found. Skipping decryption."
        );
      }
    } catch (error) {
      console.error("❌ Error while processing experience images:", error);
    }

    const allCategoriesAndItsExpenses = Object.values(
      response?.latest_trip?.budgets || {}
    ) // convert budgets object → array
      .flatMap(
        (budget) =>
          budget.categories?.map((category) => ({
            categoryName: category.category_name,
            allocatedAmountToCategory: category.allocated_amount,
            expenses:
              category.expenses?.map((expense) => ({
                expenseDescription: expense.description,
                expenseAmount: expense.amount,
                expenseDate: expense.expense_date,
              })) || [],
          })) || []
      );

    const latestTotalTripBudget = response?.budgets?.[0]?.total_amount || 0;

    const budgetManagerExpensesData = {
      latestTotalTripBudget,
      allCategoriesAndItsExpenses,
    };

    console.log("Budget Manager Expenses Data:", response?.budgets);
    // Construct final user data object
    const userData = {
      user_id: response.user_details.user_id,
      user_name: response.user_details.user_name,
      user_email: response.user_details.user_email,
      user_phoneno: decryptData(response.user_details.user_phoneno),
      user_interest:
        response?.latest_trip?.trip_interests?.map(
          (interest) => interest.interest_areas.interest_name
        ) || [response.user_details.user_interest] ||
        [],
      user_location: response.user_details.user_location,
      user_status: response.user_details.user_status,
      user_role: response.user_details.user_role,
      TripCompleted: response._counts?.total_trips || 0,
      TotalExperiences: response._counts?.total_experiences || 0,
      TotalImages: response._counts?.total_images || 0,
      TotalAmountOfAllTrips: response?._counts?.total_amount_of_all_trips || 0,
      UpComingTrips: response?._counts?.upcomingTrips || 0,
      CompletedTrips: response?._counts?.completedTrips || 0,
      CanceledTrips: response?._counts?.canceledTrips || 0,
      share_experiences: {
        ...(response?.latest_trip?.share_experiences || {}),
        experience_images: decryptedImagesUrlsOfExperiences,
      },
      allTrips: response?.all_trips,
      totalBudgetAmount: response?.latest_trip?.budgets?.total_amount || 0,
      categories: budgetManagerExpensesData,
    };

    console.log("Final User Profile Object:", userData);

    //  Send Success Response
    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully.",
      user: userData,
    });
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        "An unexpected error occurred while fetching the profile.",
    });
  }
};

//Budget Manager Controller
export const dataForBudgetManager = async (req, res, next) => {
  try {
    const response = await budgetDataForProfile(Number(req.params.user_id));
    res.status(200).json({
      message: "We reached to the data for budget Manager controller",
      budgetData: response,
    });
  } catch (dataForBudgetManagerError) {}
};

//Trips Plan Controller
export const tripsPlanData = async (req, res, next) => {
  console.log(
    "We get the user_id and we are in the tripsPlanData ",
    req.params.user_id
  );
  console.log(
    "Types of user_id and we are in the tripsPlanData ",
    typeof req.params.user_id
  );
  try {
    const fetchedDataOfTrips = await DataForTripPlans(
      Number(req.params.user_id)
    );
    console.log("We get data from DB ", fetchedDataOfTrips);

    const prepareDataForTripsPlan = fetchedDataOfTrips.map((trip) => {
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);

  return {
    tripId: trip.trip_id,
    userId: trip.user_id,
    tripTitle: trip.trip_title,
    destination: trip.destination,

    // store raw dates for logic
    rawStart: start,
    rawEnd: end,

    // formatted dates for display
    startDate: start.toLocaleDateString("en-PK", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    endDate: end.toLocaleDateString("en-PK", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),

    TripDuration: Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
    createdAt: new Date(trip.created_at).toLocaleDateString(),
    updatedAt: new Date(trip.updated_at).toLocaleDateString(),
    isCanceled: trip.isCanceled,
  };
});

    res.status(200).json({
      message: "Successfully Fetched data for the trips Plan",
      DataForTripsPlan: prepareDataForTripsPlan
    });
  } catch (tripsPlainError) {}
};


//controller for trips cancel 
export const tripPlanCancel = async (req,res,next) => {
  try{
     const response = await tripPlanCancelService(Number(req.params.trip_id));

     res.status(200).json({
      message: `${response.trip_title} trip and destination is ${response.destination} has been cancel successfully`,
      nowIsCanceledIs: response.isCanceled
     })
  }catch(tripPlanCancelError){}
}

//LogOut Controller
export const logOut = async (req, res, next) => {
  try {
    await userProfileLogOut(req.user.user_id);

    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (logoutError) {
    console.log("Error in the logout ", logoutError);
  }
};
