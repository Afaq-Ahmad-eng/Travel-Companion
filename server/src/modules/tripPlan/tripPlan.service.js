// import prisma from "../../config/database.js";

// export const createTripPlanForDB = async (tripData) => {
//   try {
//     const newTrip = await prisma.trips.create({
//       data: tripData,
//     });
//     return newTrip;
//   } catch (error) {
//     console.error("Error creating trip plan:", error);
//     throw new Error("Error creating trip plan");
//   }
// };
// export default createTripPlanForDB;

import prisma from "../../config/database.js";

export const createTripPlanForDB = async (tripData) => {
  const { user_id, trip_title, destination, interest_areas, start_date, end_date } = tripData;

  try {
    // Normalize interests array
    const interests = Array.isArray(interest_areas)
      ? interest_areas.map((i) => i.trim()).filter(Boolean)
      : typeof interest_areas === "string"
      ? interest_areas.split(",").map((i) => i.trim()).filter(Boolean)
      : [];

    if (!interests.length) throw new Error("At least one interest area required");

    // 1️⃣ Create trip
    const newTrip = await prisma.trips.create({
      data: {
        user_id,
        trip_title,
        destination,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
      },
    });

    // 2️⃣ Create interest areas (allow duplicates)
    const interestRecords = [];
    for (const name of interests) {
      const interest = await prisma.interest_areas.create({
        data: { interest_name: name },
      });
      interestRecords.push(interest);
    }

    // 3️⃣ Link trip and interest areas
    const tripInterestData = interestRecords.map((i) => ({
      trip_id: newTrip.trip_id,
      interest_id: i.interest_id,
    }));

    await prisma.trip_interests.createMany({
      data: tripInterestData,
    });

    return {
      ...newTrip,
      interest_areas: interests,
    };

  } catch (error) {
    console.error("❌ Error creating trip plan:", error);
    if(error.code === 'P2002'){
      throw {
        status: 400,
        isTripTitleExist: true,
        message: "Trip title must be unique. Please choose a different title."
      };
    }
  }
};

export default createTripPlanForDB;
