import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

//  Generate Access & Refresh Tokens
//  @param {Object} user - user object (user_id, user_email, etc.)
//  @returns {{ accessToken: string, refreshToken: string }}

// This function we use for generating access token(short - time ) and refresh token (long -time)

export const generateAccessToken = (user) => {  
    return jwt.sign(
    { user_id: user.user_id, user_email: user.user_email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" }
  );
}
export const generateRefreshToken = (user) => {  

  // Long-lived Refresh Token (30d)
  return jwt.sign(
    { user_id: user.user_id},
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
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