import prisma from "../../config/database.js";

//This function handles the creation of a new user during their initial registration.
export const createUsers = async (data) => {
  try {
    const user = await prisma.user.create({
      data: {
        user_name: data.user_name,
        user_email: data.user_email,
        user_interest: data.user_interest,
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
      message: "Dear user, you are not registered with us. Thank you!",
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
    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { user_updatedAt: new Date() },
      select: {
        user_id: true,
        user_name: true,
        user_email: true,
        user_updatedAt: true,
        user_status: true,
        user_role: true
      },
    });

    return updatedUser;
  } catch (error) {
    throw new Error("Login failed. Please check your credentials.");
  }
}
