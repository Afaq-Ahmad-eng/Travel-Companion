//Internal modules
import { getUserDataForUserToken, saveUserNewRefreshTokenInDB } from "../modules/auth/auth.service.js";
import { getRefreshTokenByUserId } from "../modules/shareExperience/shareExperience.service.js";
import { AppError } from "../utils/AppError.js";
import { setAccessToken, setRefreshToken } from "../utils/cookies.js";
import { decryptData, encryptData } from "../utils/secure.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/tokens.js";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

//Create object to use if the token is not valid
const objectForNotValidToken = { valid: false, expired: true };

export const protectedRoutes = async (req, res, next) => {
  try {
    //We get the access and refresh tokens from cookies in encrypted form, so we directly decrypt them as well.
    const decryptedAccessToken = decryptData(req?.cookies?.user_accessToken);
    const decryptedRefreshToken = decryptData(req?.cookies?.user_refreshToken);

    //admin tokens

    const decryptAdminAccessToken = decryptData(req?.cookies?.admin_accessToken)
    const decryptAdminRefreshToken = decryptData(req?.cookies?.admin_refreshToken)

    //if admin login from the profile means admin login as a user and login as a admin from the profile
     const isAdminRoute = req.originalUrl.startsWith("/AdminDashboard");

    // If this is an ADMIN route → skip user token validation
    if (isAdminRoute) {
      return next();
    }

    // If this is NOT admin route → ignore admin tokens entirely
    // (do not block user)
    if (!isAdminRoute && (decryptAdminAccessToken || decryptAdminRefreshToken)) {
      // Continue → validate user tokens normally
    }

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
          const DBResultOfUser = await getUserDataForUserToken(isRefreshTokenValid.decoded.user_id);
          console.log("we get the user data from the tokens and we are in the middleware ",DBResultOfUser);
          const jwtPayloadForUser = {
            user_id: DBResultOfUser.user_id,
            user_email: DBResultOfUser.user_email
          }
          //Renew the access token using refresh token
          const newAccessToken = generateAccessToken(jwtPayloadForUser);

          // const newRefreshTokenForUser = generateRefreshToken(jwtPayloadForUser);
          // const newRefreshTokenForUserEncrypt = encryptData(newRefreshTokenForUser);

          //Here we set the new created access token for the cookies
          setAccessToken(res,"user_accessToken", encryptData(newAccessToken));
          // setRefreshToken(res,"user_refreshToken",newRefreshTokenForUserEncrypt)

          // const saveNewRefreshTokenInDB = await saveUserNewRefreshTokenInDB(jwtPayloadForUser.user_id, newRefreshTokenForUserEncrypt);
         
          // store user data for later use
          req.user = isRefreshTokenValid.decoded;

          // token then pass control to the next middleware or to the actual endpoint/function
          return next();
        } else {
          //Token mismatch or invalid, force re-login
          throw new AppError(
            "Your session has expired. Please log in again to continue using this resource.",
            401,
            null,
            {
              TokensValid: false,
              TokensExpire: true,
              showLoginAndRegistrationForm: true,
            }
          );
        }
        //If any other error occurs during refresh token checking, the catch block will be executed
      } catch (errorInGeneratingAccessToken) {
        throw new AppError(
          "Failed to renew session. Please login again.",
          401,
          null,
          {
            success: false,
            showLoginAndRegistrationForm: true,
          }
        );
      }
      //If both access and refresh token is not valid then return status code 401 (means unauthorized) and attach object with this so, the click check this object and then redirect user to the login form
    } else {
      throw new AppError(
        "Dear user, your session has expired. Please log in again to continue.",
        401,
        null,
        {
          TokensValid: false,
          TokensExpire: true,
          showLoginAndRegistrationForm: true,
        }
      );
    }
    //if there is any error in this protected routes then we send status code 500 (means server error) and attach object with this for some information
  } catch (protectedRoutesError) {
    //Only wrap unexpected errors
    if (protectedRoutesError instanceof AppError) {
      return next(protectedRoutesError); // Let your global errorHandler manage it
    }

    // Unexpected ones → wrap and send forward
    next(
      new AppError("Server error in authentication", 500, null, {
        success: false,
      })
    );
  }
};
