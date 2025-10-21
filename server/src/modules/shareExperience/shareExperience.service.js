//This import for to use the prisma models 
import prisma from "../../config/database.js";

//This function is for to store experience like title, description, blog, rating, and trip_id as forign key
export const saveExperience = async ({ title, description, blog, rating, trip_id }) => {
  try{
  const newTrip = await prisma.share_experiences.create({
    data: {
      title,
      description,
      blog: blog || null,
      rating: parseFloat(rating),
      trip_id
    }
  });
  return newTrip;
}catch(shareExperienceTableError){

  if (shareExperienceTableError.code === "P2002") {
    
    if (shareExperienceTableError.meta.target === "unique_title") {
        throw {
          status: 409,
          isExperienceTitleExist: true,
          message: `Dear user, the entered title (${title}) is already in use. Please enter a different one.`,
        };
      }
    } else {
      throw {
      status: 500,
      message: "Something went wrong while creating the experience.",
    };
    }
}
};

//This function is use to store images urls in the DB and the images we store at MEGA cloud place
export const saveExperienceImages = async ({encryptedPictureUrls,experienceId}) => {
   const imagesUrls = await prisma.experience_images.createMany({
        data: encryptedPictureUrls.map((url) => ({
          experience_id: experienceId, 
          image_url: url,
        })),
      });
      return imagesUrls;
}

//This function retrieves the refresh token stored in the database to verify whether it matches the refresh token stored in the cookies

export const getRefreshTokenByUserId = async (userId) => {
  try {
    const result = await prisma.user_refresh_token.findUnique({
      where: {
        user_id: userId, // unique user_id (assuming unique in schema)
      },
      select: {
        refresh_token: true, // only return refresh_token
      },
    });

    return result ? result.refresh_token : null;
    
  } catch (error) {
    throw new Error("Could not fetch refresh token");
  }
};

//function for fetch the trips data so, we can use the trip id and the trip title at the time of sharing experience
export const getLatestTripByUserId = async (user_id) => {
  try {
    const trips = await prisma.trips.findMany({
      where: { user_id },
      orderBy: { created_at: "desc" }, // latest trip first
      take: 1, // only get the latest one
      select: {
        trip_id: true,
        trip_title: true,
      },
    });

    return trips[0] || null; // return the latest trip or null if none
  } catch (error) {
    throw new Error("Could not fetch latest trip");
  }
};
