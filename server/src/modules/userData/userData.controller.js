import { userDataForReport } from "./userData.service.js";

export const fetchUserData = async (req,res, next) => {
    console.log("we get user Id from middleware ", req.user.user_id);
    const responseFromDb = await userDataForReport(req.user.user_id)
    
    res.status(200).json({
        success: true,
        message:"We successfuly fetch user data for our need",
        UserData: responseFromDb
    })
}