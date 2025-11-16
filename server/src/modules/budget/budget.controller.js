// Internal module
import {
  storingDataOfBudgetsAndCategeriesAndExpenses,
  userAndTripDataForBudgetManger,
  tripDataForBudgetCheck,
  tripWithOutBudget,
} from "./budget.service.js";

export const budgetManager = async (request, response) => {
  let responseForUser = null;
  try {
    console.log(
      "We are at budget Manager endpoint and we get data from the server ",
      request.body
    );

    const budgetManagerData = request.body;
    const tripIdForForginKeyInBudgetManagerData = request.user.user_id;

    responseForUser = await userAndTripDataForBudgetManger(
      tripIdForForginKeyInBudgetManagerData
    );
    console.log("we get data of the user for budget manager ", responseForUser);
    await storingDataOfBudgetsAndCategeriesAndExpenses(
      budgetManagerData,
      responseForUser.trips
    );

    response.status(200).json({
      success: true,
      budgetManagerDataSave: true,
      message: `Dear ${responseForUser.user_name}, your budget data has been saved successfully. Thank you!`,
    });
  } catch (budgetManagerError) {
    response.status(budgetManagerError.status || 500).json({
      message: budgetManagerError.message,
    });
  }
};

export const checkBudgetManagerStatus = async (request, response) => {
  try {
    const tripsDataForBudgetCheck = await tripDataForBudgetCheck(
      request.user.user_id
    );
    
    if (!tripsDataForBudgetCheck) {
      return response.json({
        showUpcomingTripAlert: false,
        mustEnterBudget: false
      });
    }

    const today = new Date();
    const startDate = new Date(tripsDataForBudgetCheck.start_date);
    const endDate = new Date(tripsDataForBudgetCheck.end_date);
    const diffInDays = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));

    let showUpcomingTripAlert = false;
    let mustEnterBudget = false;
    let message = "";

     if (diffInDays <= 2 && diffInDays > 0) {
      showUpcomingTripAlert = true;
      message = `Your trip "${tripsDataForBudgetCheck.trip_title}" starts in ${diffInDays} day(s)!`;
    } else if (today >= startDate && today <= endDate) {
      mustEnterBudget = true;
      message = `Your trip "${tripsDataForBudgetCheck.trip_title}" is active. Please enter your trip budget.`;
    } else if (today > endDate) {
      message = `Your trip "${tripsDataForBudgetCheck.trip_title}" has ended. You can now share your experience.`;
    }

    return response.status(200).json({
      success: true,
      showUpcomingTripAlert,
      mustEnterBudget,
      message,
      trips: tripsDataForBudgetCheck,
    });
  } catch (checkBudgetManagerError) {
    console.log("Error occurred while checking budget manager status: ", checkBudgetManagerError);
    response.status(checkBudgetManagerError.prismaStatusCode || 500).json({
      showUpcomingTripAlert: false,
      mustEnterBudget: false,
      message: checkBudgetManagerError.message || "UNKNOWN_DB_ERROR",
    });
  }
};


//controller for the unset trip budget
export const unsetTripBudget = async (req, res, next) =>{
  try{
    const {user_id} = req.user;
    console.log("We chech the user id ", user_id);
    console.log("We chech the user id type ", typeof user_id);

    const response = await tripWithOutBudget(user_id);
    
    res.status(200).json({
      meassge: "we reached at the unsetTripBudget controller",
      data: response
    })
  }catch(error){
     console.log(error);
  }
}
