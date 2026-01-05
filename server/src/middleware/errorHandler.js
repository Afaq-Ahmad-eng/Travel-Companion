import { AppError } from "../utils/AppError.js";

export function errorHandler(err, req, res, next) {
  
  console.error("Global Error:", err.message);
  console.error("Status Code :", err.statusCode);
  console.error("Error Message :", err.message);


  if (err instanceof AppError) {
    console.log("Error occur ", err.meta);
    
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
      ...(err.meta && err.meta),
  });
  }

  res.status(500).json({
    success: false,
    message: "Unexpected error occurred",
  });
//   next()
}