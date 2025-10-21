import { tripSchema } from "./tripPlan.validator.js";
import {createTripPlanForDB} from "./tripPlan.service.js";
export const createTripPlan = async (req, res) => {
  try {

    console.log("we print request only the user data ",req.user);
    
    
    console.log(`We on the create Trip Plan endpoint `,req.body);
    
    // Server-side validation (matches client rules)
    const { error , value} = tripSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    // Normalize interest_areas (like before)
    let interests = [];
    if (Array.isArray(value.interest_areas)) {
      interests = value.interest_areas.map((i) => i.trim()).filter(Boolean);
    } else if (typeof value.interest_areas === "string") {
      interests = value.interest_areas.split(",").map((i) => i.trim()).filter(Boolean);
    }
    

     // Proceed with DB insertion
    const tripData = {
      user_id: req.user.user_id,
      trip_title: value.trip_title,
      destination: value.destination,
      interest_areas: interests,
      start_date: new Date(value.start_date),
      end_date: new Date(value.end_date),
    };

    const createdTrip = await createTripPlanForDB(tripData);
    console.log("✅ Trip created successfully:", createdTrip);

    

    return res.status(201).json({ success: true, message: "Trip plan created successfully!", createdTrip });
  } catch (error) {
    console.error("createTripPlan error:", error);
    return res.status(500).json({
        status: error.status || 500, 
        isTripTitleExist: error.isTripTitleExist || false,
        success: false,
        message: error.message || "Server error creating trip plan."
    });
  }
};

export default createTripPlan;
