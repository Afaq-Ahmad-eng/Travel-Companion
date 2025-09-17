//Expternal modules
import express from "express";
import cors from "cors";

//Internal modules
import userRoutes from "./modules/user/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

//Express app initialization
const app = express();

//Middlewares
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use("/user", userRoutes);

app.use('/auth',authRoutes)


export default app;