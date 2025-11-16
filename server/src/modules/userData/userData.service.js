import prisma from "../../config/database.js";

export const userDataForReport = async (user_id) => {
    try{
        const responseForReport = await prisma.user.findUnique({
            where:{user_id}
        })
        return responseForReport;
    }catch(err){
        console.error(err);
    }
}