//Dotenv configuration
import dotenv from "dotenv";
dotenv.config();

//App entry point
import app from "./src/app.js";
app.listen(process.env.SERVER_PORT, () => {

  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});