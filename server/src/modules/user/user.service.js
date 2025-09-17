// src/modules/user/user.service.js
import prisma from "../../config/database.js";

export const createUsers = async (data) => {
  console.log("this data is come from createUser function : ", data);

  try {
    const user = await prisma.user.create({
      data: {
        user_name: data.user_name,
        user_email: data.user_email,
        user_phoneno: data.user_phoneno,
        user_password: data.user_password
      }
    });
    console.log("this data is come from createUser function using prisma : ", user);
    return user;
  } catch (err) {
    console.error("Prisma error:", err.message);
    throw err;
  }
};


export const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

