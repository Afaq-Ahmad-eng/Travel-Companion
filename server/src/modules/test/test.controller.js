import { getTotalTripsOfAUser } from "./test.service.js";
export const testing = async (req,res)=>{
    // const { trip_id } = req.params;
    // console.log("We get the trip id ",trip_id);
    // console.log("type of this trip id is  ", typeof Number(trip_id));
    // let response = null;
    // try{
    //     response = await shareEperienceData(Number(trip_id));
    //     console.log("we get response from DB ", response);
        
    // }catch(error){
    //     console.log(error);
        
    // }
    // res.status(200).json({
    //     message: "We reached to the test endpoint ",
    //     tripsData: response
    // })

    const totalTripsOfAUser = await getTotalTripsOfAUser()        
    console.log("The total trips of a user are ", totalTripsOfAUser);
    const userTrips = totalTripsOfAUser.map(item => ({
        user_id: item.user_id,
        total_trips: item._count.trip_id
    }));
    console.log("The user trips data is ", userTrips);
  res.status(200).json({
    message: "We reached to the test endpoint ",
    tripsData: userTrips
  })
}