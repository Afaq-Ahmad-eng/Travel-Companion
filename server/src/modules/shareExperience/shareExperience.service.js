//This import for to use the prisma models 
import prisma from "../../config/database.js";

//This function is for to store experience like title, description, blog, rating, and user_id as forign key
export const saveExperience = async ({ title, description, blog, rating, user_id }) => {
  try{
  const newTrip = await prisma.share_experiences.create({
    data: {
      title,
      description,
      blog: blog || null,
      rating: parseFloat(rating),
      user_id
    }
  });
  return newTrip;
}catch(shareExperienceTableError){

  if (shareExperienceTableError.code === "P2002") {
    
    if (shareExperienceTableError.meta.target === "unique_title") {
        throw {
          status: 409,
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

