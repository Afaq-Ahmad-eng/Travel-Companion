import prisma from "../../config/database.js";
import { AppError } from "../../utils/AppError.js";

//This function handles the creation of a new user during their initial registration.
export const createUsers = async (data) => {
  
  try {
    const user = await prisma.user.create({
      data: {
        user_name: data.user_name,
        user_email: data.user_email,
        user_location: data.user_location,
        user_password: data.user_password,
        user_phoneno: data.user_phoneno,
      },
    });
    return user;
  } catch (err) {
    if (err.code === "P2002") {
      if (err.meta.target === "user_name") {
        throw {
          status: 409,
          message: `Dear user your name ${data.user_name} is already in use. Please enter a different one.`,
        };
      } else if (err.meta.target === "user_email") {
        throw {
          status: 409,
          message: `Dear user your email ${data.user_email} is already in use. Please enter a different one.`,
        };
      }
    } else {
      throw {
        status: 500,
        message: "Something went wrong while creating the user",
      };
    }
  }
};

//This function is used to fetch user data and send it to the controller, which then passes it to the frontend to display in an alert.
export const getUserByEmail = async (user_email) => {
  try {
    const user = await prisma.user.findUnique({ where: { user_email } });
        
    return user;
  
  } catch (error) {
        
    throw {
      status: 404,
      message: "Invalid credentials. Please provide the correct credentials. Thank you!",
    };
  }
};

//This function is used to fetch data from the user_refresh_token table to verify whether the refresh token received from the frontend matches the one stored in the database.
export const getUserById = async (user_id) => {
  try {
    const user = await prisma.user_refresh_token.findUnique({ where: { user_id } });
    return user;
  } catch (error) {
    throw new Error(
    {
        status:404,
        message:"Dear user, you are not registered with us. Thank you!"
    })
  }
};

// export const getAllUsers = async () => {
//   return await prisma.user.findMany();
// };

//This function is used to store the refresh token in the database. If a refresh token already exists, it updates the old one with the new token.
export const createRefreshToken = async (userId, refreshToken) => {
  try {
    const user = await prisma.user_refresh_token.upsert({
      where: { user_id: userId },
      update: {
        refresh_token: refreshToken,
      },
      create: {
        refresh_token: refreshToken,
        user: {
          connect: { user_id: userId },
        },
      },
    });
    return user;
  } catch (err) {
    throw err;
  }
};

//This function is used to update only the user_updatedAt field in the database to track the user's last login time.
export const updateUserUpdatedAtField = async (user_id) => {
  try {
    // find the current user
    const existingUser = await prisma.user.findUnique({
      where: { user_id },
      select: { user_status: true },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    //  build dynamic update object
    const updateData = {
      user_updatedAt: new Date(),
      is_logged_in: true,
    };

    // conditionally update status
    if (existingUser.user_status === "pending") {
      updateData.user_status = "active";
    }

    // update user
    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: updateData,
      select: {
        user_id: true,
        user_name: true,
        user_email: true,
        user_updatedAt: true,
        user_status: true,
      },
    });

    return updatedUser;
  } catch (error) {
    throw new Error("Login failed. Please check your credentials.");
  }
};

export const getUserDataForUserToken = async (userId) => {
  try{
    const result = await prisma.user.findUnique({
      where:{user_id: userId},
      select:{
        user_id:true,
        user_email: true
      }
    })
 return result;
  }catch(error){
 console.log("we get when fetching user data for token ", error);
  }
}

export const saveUserNewRefreshTokenInDB = async (userId, newRefreshToken) => {
  try{
       const res = await prisma.user_refresh_token.upsert({
        where:{user_id:userId},
        update:{resfresh_token: newRefreshToken},
        create:{
          user_id: userId,
          refresh_token: newRefreshToken
        }})
  }catch(error){
    console.log(error);
  }
}

export const getAdminDataForAdminToken = async (adminId) => {
  try{
    const result = await prisma.admin.findUnique({
      where: {admin_id: adminId}
    })
    return result;
  }catch(error){
    console.log(error);
  }
}

export const saveNewRefreshTokenOfAdmin = async (adminId, encryptRefreshToken) => {
  try {
    return await prisma.admin_refresh_token.upsert({
      where: { admin_id: adminId },
      update: { refresh_token: encryptRefreshToken },
      create: {
        admin_id: adminId,
        refresh_token: encryptRefreshToken,
      },
    });
  } catch (error) {
    console.error("Error saving admin refresh token:", error);
    throw new AppError(error, 690)
  }
};