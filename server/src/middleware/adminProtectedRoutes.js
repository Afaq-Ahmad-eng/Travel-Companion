//Internal modules
import { getAdminRefreshTokenById } from "../modules/admin/admin.service.js";
import {
  getAdminDataForAdminToken,
  // saveNewRefreshTokenOfAdmin,
} from "../modules/auth/auth.service.js";
import { AppError } from "../utils/AppError.js";
import { setAccessToken } from "../utils/cookies.js";
import { decryptData, encryptData } from "../utils/secure.js";
import {
  generateAccessToken,
  // generateRefreshToken,
  verifyToken,
} from "../utils/tokens.js";
import dotenv from "dotenv";

dotenv.config();

// Default object if tokens are invalid or expired
const objectForNotValidToken = { valid: false, expired: true };

export const adminProtectedRoutes = async (req, res, next) => {
  try {
    //Decrypt tokens from cookies
    const decryptedAccessToken = decryptData(req?.cookies?.admin_accessToken);
    const decryptedRefreshToken = decryptData(req?.cookies?.admin_refreshToken);

    //if admin login want to login as a user
    const decryptedUserAccessToken = decryptData(
      req?.cookies?.user_accessToken
    );
    const decryptedUserRefreshToken = decryptData(
      req?.cookies?.user_refreshToken
    );

    if (decryptedUserAccessToken || decryptedUserRefreshToken) return next();
    //Verify tokens

    const isAccessTokenValid = decryptedAccessToken
      ? verifyToken(decryptedAccessToken, process.env.ACCESS_TOKEN_SECRET)
      : objectForNotValidToken;

    const isRefreshTokenValid = decryptedRefreshToken
      ? verifyToken(decryptedRefreshToken, process.env.REFRESH_TOKEN_SECRET)
      : objectForNotValidToken;

    //If access token is valid — allow access
    if (isAccessTokenValid.valid) {
      req.admin = isAccessTokenValid.decoded; // store admin info
      return next();
    }

    //If access token expired but refresh token valid, renew it
    else if (isRefreshTokenValid.valid) {
      try {
        // Fetch refresh token from DB (stored encrypted)
        const storedRefreshToken = await getAdminRefreshTokenById(
          isRefreshTokenValid.decoded.admin_id
        );

        const adminDataFromDB = await getAdminDataForAdminToken(
          isRefreshTokenValid.decoded.admin_id
        );

        const jwtPayload = {
          admin_id: adminDataFromDB.admin_id,
          admin_email: adminDataFromDB.admin_email,
          admin_role: adminDataFromDB.role,
        };

        //the problem is in the below part
        const decryptedStoredRefreshToken = decryptData(
          storedRefreshToken.refresh_token
        );

        // Verify DB refresh token
        const isDbRefreshTokenValid = decryptedStoredRefreshToken
          ? verifyToken(
              decryptedStoredRefreshToken,
              process.env.REFRESH_TOKEN_SECRET
            )
          : objectForNotValidToken;

        try {
          if (
            isRefreshTokenValid.valid === isDbRefreshTokenValid.valid &&
            decryptedRefreshToken === decryptedStoredRefreshToken
          ) {
            console.log("Condition passed, renewing tokens...");

            const newAccessToken = generateAccessToken(jwtPayload);
            const newAccessTokenEncrypted = encryptData(newAccessToken);
            // const newRefreshToken = generateRefreshToken(jwtPayload);
            // const newRefreshTokenEncrypted = encryptData(newRefreshToken);

            setAccessToken(res, "admin_accessToken", newAccessTokenEncrypted);
            // setRefreshToken(res, "admin_refreshToken", newRefreshTokenEncrypted);

            // console.log("Admin ID from JWT payload:", jwtPayload.admin_id);

            // const DBResult = await saveNewRefreshTokenOfAdmin(
            //   jwtPayload.admin_id,
            //   newRefreshTokenEncrypted
            // );

            req.admin = isRefreshTokenValid.decoded;
            return next();
          }
          // else {
          //   console.log("Refresh token validation failed.");
          //   return res.status(401).json({ message: "Invalid refresh token" });
          // }
        } catch (error) {
          console.error("Error in refresh token flow:", error);
          return res.status(500).json({ message: "Internal server error" });
        }
      } catch (errorInGeneratingAccessToken) {
        console.log(
          "We get error during token rotation ",
          errorInGeneratingAccessToken
        );

        throw new AppError(
          "Failed to renew admin session. Please login again.",
          401,
          null,
          {
            success: false,
            showLoginAndRegistrationForm: true,
          }
        );
      }
    }

    //If both tokens invalid
    else {
      throw new AppError(
        "Dear admin, your session has expired. Please log in again to continue.",
        401,
        null,
        {
          TokensValid: false,
          TokensExpire: true,
          showLoginAndRegistrationForm: true,
        }
      );
    }
  } catch (adminProtectedRoutesError) {
    console.log("We get error ", adminProtectedRoutesError);

    if (adminProtectedRoutesError instanceof AppError) {
      return next(adminProtectedRoutesError);
    }

    next(
      new AppError("Server error in admin authentication", 500, null, {
        success: false,
      })
    );
  }
};
