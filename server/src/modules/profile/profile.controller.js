// //Internal modules
// import { decryptData } from "../../utils/secure.js";
// import { getUserByIdForProfile } from "./profile.service.js";

// //this is the controller for the profile
// export const profile = async (profileRequest, profileResponse) => {
//   try {
//     const response = await getUserByIdForProfile(profileRequest.user.user_id);
//     console.log("we get data for user Profile from DB ", response);

//     if (!response) {
//       return profileResponse.status(404).json({
//         success: false,
//         message: "User not found. Please ensure you're logged in correctly.",
//       });
//     }

//     let decryptedImagesUrlsOfExperiences = [];
//     let imageUrls = [];

//     try {
//       // Safely check if latest_trip and its nested properties exist
//       const experiences = response?.latest_trip?.share_experiences;

//       if (
//         experiences?.experience_images &&
//         Array.isArray(experiences.experience_images)
//       ) {
//         imageUrls = experiences.experience_images;
//         console.log("Fetched experience images:", imageUrls);

//         decryptedImagesUrlsOfExperiences = imageUrls.map((img) => ({
//           ...img,
//           image_url: decryptData(img.image_url),
//         }));
//       } else {
//         // No trips or no images — just log it and continue
//         console.log(
//           "No trips or experience images found."
//         );
//       }
//     } catch (error) {
//       console.error("Error while processing experience images:", error);
//       throw new Error("Error while decrypting user experience images");
//     }

//     //extract category array
//     const allCategoriesAndItsExpenses =
//       response?.budgets?.flatMap(
//         (budget) =>
//           budget.categories?.map((category) => ({
//             categoryName: category.category_name,
//             allocatedAmountToCategory: category.allocated_amount,
//             expenses:
//               category.expenses?.map((expense) => ({
//                 expenseDescription: expense.description,
//                 expenseAmount: expense.amount,
//                 expenseDate: expense.expense_date,
//               })) || [],
//           })) || []
//       ) || [];

//     const totalTripBudget = response?.budgets?.[0]?.total_amount || 0;
//     const budgetManagerExpensesData = {
//       totalTripBudget,
//       allCategoriesAndItsExpenses,
//     };

//     // Construct final user data object
//     let userData = {};
//     try {
//       userData = {
//         user_name: response.user_details.user_name,
//         user_email: response.user_details.user_email,
//         user_phoneno: decryptData(response.user_details.user_phoneno),
//         user_interest: response.latest_trip.trip_interests.map(
//           (interest) => interest.interest_areas.interest_name
//         ),
//         user_location: response.user_details.user_location,
//         user_status: response.user_details.user_status,
//         user_role: response.user_details.user_role,
//         TripCompleted: response._counts.total_trips,
//         TotalExperiences: response._counts.total_experiences,
//         TotalImages: response._counts.total_images,
//         share_experiences: {
//           ...response.latest_trip.share_experiences,
//           experience_images: decryptedImagesUrlsOfExperiences,
//         },
//         totalBudgetAmount: response.latest_trip.budgets || 0,
//         categories: budgetManagerExpensesData,
//       };
//     } catch (error) {
//       throw {
//         message: "Error while constructing user data for profile",
//       };
//     }
//     console.log("we get data of the user for profile ", userData);

//     return profileResponse.status(200).json({
//       success: true,
//       message: "User profile retrieved successfully.",
//       user: userData,
//     });
//   } catch (error) {
//     console.log("❌ Error fetching profile:", error);
//     return profileResponse.status(error.status || 500).json({
//       success: false,
//       message:
//         error.message ||
//         "An unexpected error occurred while fetching the profile.",
//     });
//   }
// };

// Internal modules
import { decryptData } from "../../utils/secure.js";
import { getUserByIdForProfile } from "./profile.service.js";

//  Profile Controller
export const profile = async (req, res) => {
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
        decryptedImagesUrlsOfExperiences = experiences.experience_images.map((img) => ({
          ...img,
          image_url: decryptData(img.image_url),
        }));
      } else {
        console.log("No trips or experience images found. Skipping decryption.");
      }
    } catch (error) {
      console.error("❌ Error while processing experience images:", error);
    }

    // Extract categories and expenses from budgets (if any)
    // const allCategoriesAndItsExpenses =
    //   response?.latest_trip?.[budgets]?.flatMap((budget) =>
    //     budget.categories?.map((category) => ({
    //       categoryName: category.category_name,
    //       allocatedAmountToCategory: category.allocated_amount,
    //       expenses:
    //         category.expenses?.map((expense) => ({
    //           expenseDescription: expense.description,
    //           expenseAmount: expense.amount,
    //           expenseDate: expense.expense_date,
    //         })) || [],
    //     })) || []
    //   ) || [];


    const allCategoriesAndItsExpenses =
  Object.values(response?.latest_trip?.budgets || {}) // convert budgets object → array
    .flatMap((budget) =>
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
      user_name: response.user_details.user_name,
      user_email: response.user_details.user_email,
      user_phoneno: decryptData(response.user_details.user_phoneno),
      user_interest:
        response?.latest_trip?.trip_interests?.map(
          (interest) => interest.interest_areas.interest_name
        ) || [response.user_details.user_interest] || [],
      user_location: response.user_details.user_location,
      user_status: response.user_details.user_status,
      user_role: response.user_details.user_role,
      TripCompleted: response._counts?.total_trips || 0,
      TotalExperiences: response._counts?.total_experiences || 0,
      TotalImages: response._counts?.total_images || 0,
      share_experiences: {
        ...(response?.latest_trip?.share_experiences || {}),
        experience_images: decryptedImagesUrlsOfExperiences,
      },
      totalBudgetAmount: response?.latest_trip?.budgets.total_amount || 0,
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
