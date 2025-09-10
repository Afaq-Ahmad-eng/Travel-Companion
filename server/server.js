//Expternal modules
import express from "express";
import cors from "cors";

//Internal modules
import authRoutes from "./src/routes/authRoutes.js";

//Express app initialization
const app = express();

//Port
const PORT = 3001

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use("/user/auth", authRoutes);

app.listen(PORT, () => {
    
  console.log(`Server is running on port ${PORT}`);
});