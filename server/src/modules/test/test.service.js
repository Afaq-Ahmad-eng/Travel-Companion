import prisma from "../../config/database.js";

// export const shareEperienceData = async (trip_id)=>{
//     try{
//     const res = await prisma.share_experiences.findUnique({
//         where:{trip_id},
//         include:{
//             trips: {
//                 select :{
//                 trip_id:true,
//                 trip_title:true,
//                 user:{
//                     select:{
//                        user_id: true,
//                        user_name: true,
//                        user_email: true
//                     }
//                 }
//             }
//             },
//             experience_images: true
//         }
//     })
//     return res
// }catch(error){
//     console.log("We get error from share experience ", error);
    
// }
// }

export const getTotalTripsOfAUser = async ()=>{
    try{
        const res = await prisma.trips.groupBy({
            by: ['user_id'],
            _count: {
                trip_id: true,
            },
        });
        return res;
    }catch(error){
        console.log("We get error from getTotalTripsOfAUser ", error);
    }
}