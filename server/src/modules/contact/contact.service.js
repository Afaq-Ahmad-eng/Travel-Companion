import prisma from "../../config/database.js"
export const saveComplaint = async (userDataForReport)=>{
    console.log("We are at save complaint function in the contact service file ",userDataForReport);

    try{
       const saveUserComplaint = await prisma.complaint.create({
         data:{
            userId: userDataForReport.userId,
            subject: userDataForReport.subject,
            description: userDataForReport.description,
            category: userDataForReport.category,
            fileUrl: userDataForReport.fileUrl
         }
       })
    }catch(saveComplaintError){
        console.log("we get error save complaint Error ", saveComplaintError);
    }
}