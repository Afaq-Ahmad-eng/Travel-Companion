import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

//  Generate Access & Refresh Tokens
//  @param {Object} user - user object (user_id, user_email, etc.)
//  @returns {{ accessToken: string, refreshToken: string }}

// This function we use for generating access token(short - time ) and refresh token (long -time)

export const generateAccessToken = (user) => {  
  console.log("we are in the generate access token ", user);
  
  if(user.admin_role && user.admin_role === 'admin'){
    console.log("We are in the if condition of admin access token ");
    return jwt.sign(
    { admin_id: user.admin_id, admin_email: user.admin_email , role: user.admin_role},
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" }
  );
  } else {
    return jwt.sign(
      { user_id: user.user_id, user_email: user.user_email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );
  }
}
export const generateRefreshToken = (user) => {  
  console.log("We are in the generate refrsh token ", user);
  
   if(user.admin_role && user.admin_role === 'admin'){
    console.log("We are in the if condition of admin of refresh token ");
    
    return jwt.sign(
    { admin_id: user.admin_id, role: user.admin_role},
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  } else {
    return jwt.sign(
      { user_id: user.user_id},
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
  }
};


//Below function for verify the token

export const verifyToken = (token, key) => {
  try {
    const decoded = jwt.verify(token, key); 
    return { valid: true, expired: false, decoded };
  } catch (err) {    
    return {
      valid: false,
      expired: err.name === "TokenExpiredError",
      decodedUser: null,
    };
  }
};