//Internal modules
import { getRefreshTokenByUserId } from "../modules/shareExperience/shareExperience.service.js";
import { setAccessToken } from "../utils/cookies.js";
import { decryptData, encryptData } from "../utils/secure.js";
import { generateAccessToken, verifyToken } from "../utils/tokens.js";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

//Create object to use if the token is not valid
const objectForNotValidToken = { valid: false, expired: true };

export const protectedRoutes = async (req, res, next) => {
  try {
    //We get the access and refresh tokens from cookies in encrypted form, so we directly decrypt them as well.
    const decryptedAccessToken = decryptData(req?.cookies?.accessToken);
    const decryptedRefreshToken = decryptData(req?.cookies?.refreshToken);

    //Verify whether the access token is valid or not (come from cookie)
    const isAccessTokenValid = decryptedAccessToken
      ? verifyToken(decryptedAccessToken, process.env.ACCESS_TOKEN_SECRET)
      : objectForNotValidToken;

    // Verify whether the refresh token is valid or not (come from cookie)
    const isRefreshTokenValid = decryptedRefreshToken
      ? verifyToken(decryptedRefreshToken, process.env.REFRESH_TOKEN_SECRET)
      : objectForNotValidToken;

    //if the access token is valid
    if (isAccessTokenValid.valid) {
      // store user data for later use
      req.user = isAccessTokenValid.decoded;

      //then pass control to the next middleware or to the actual endpoint/function
      return next();

      //if the access token is not valid then first renew the access token using rfresh
    } else if (isRefreshTokenValid.valid) {
      try {
        //here we get refresh token store in the DB
        const getRefreshTokenFromDB = await getRefreshTokenByUserId(
          isRefreshTokenValid.decoded.user_id
        );

        //Here we decrypt the refresh token retrieved from the database, since it is stored there in encrypted form
        const decryptedRefresTokenOfTheDB = decryptData(getRefreshTokenFromDB);

        //here we verify that our refresh token is valid or not (come from DB)
        const isDbRefreshTokenValid = decryptedRefresTokenOfTheDB
          ? verifyToken(
              decryptedRefresTokenOfTheDB,
              process.env.REFRESH_TOKEN_SECRET
            )
          : objectForNotValidToken;

        //Check whether both refresh tokens (from cookie and DB) are the same and valid. If yes, renew the access token and then pass control to the next middleware or the actual function.
        if (
          isRefreshTokenValid.valid === isDbRefreshTokenValid.valid &&
          decryptedRefreshToken === decryptedRefresTokenOfTheDB
        ) {
          //Renew the access token using refresh token
          const newAccessToken = generateAccessToken(
            isRefreshTokenValid.decoded
          );

          //Here we set the new created access token for the cookies
          setAccessToken(res, encryptData(newAccessToken));

          // store user data for later use
          req.user = isRefreshTokenValid.decoded;

          // token then pass control to the next middleware or to the actual endpoint/function
          return next();
        } else {
          //Token mismatch or invalid, force re-login
          return res.status(401).json({
            TokensValid: false,
            TokensExpire: true,
            message: "Session expired. Please login",
          });
        }
        //If any other error occurs during refresh token checking, the catch block will be executed
      } catch (errorInGeneratingAccessToken) {
        return res.status(401).json({
          success: false,
          message: "Failed to renew session. Please login again.",
        });
      }
      //If both access and refresh token is not valid then return status code 401 (means unauthorized) and attach object with this so, the click check this object and then redirect user to the login form
    } else {
      return res.status(401).json({
        TokensValid: false,
        TokensExpire: true,
        message: "Session expired. Please login",
      });
    }
    //if there is any error in this protected routes then we send status code 500 (means server error) and attach object with this for some information
  } catch (protectedRoutesError) {
    return res
      .status(500)
      .json({ success: false, message: "Server error in authentication" });
  }
};
