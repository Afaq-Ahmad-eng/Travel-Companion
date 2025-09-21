// src/modules/user/user.service.js
import prisma from "../../config/database.js";

export const createUsers = async (data) => {

  try {
    const user = await prisma.user.create({
      data: {
        user_name: data.user_name,
        user_email: data.user_email,
        user_phoneno: data.user_phoneno,
        user_password: data.user_password
      }
    });
    return user;
  } catch (err) {
  
  if (err.code === "P2002") {
    if(err.meta.target === "user_name"){
      throw {
        status: 409,
        message: `Dear user your name ${data.user_name} is already in use. Please enter a different one.`
      }
    }else if(err.meta.target === "user_email"){
       throw {
        status: 409,
        message: `Dear user your email ${data.user_email} is already in use. Please enter a different one.`
      }
    }
    }else{
       throw {
        status: 500,
        message: "Something went wrong while creating the user"
      }
    }
  }
};


export const getUserByEmail = async (user_email) => {
  return await prisma.user.findUnique({ where: { user_email } });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

