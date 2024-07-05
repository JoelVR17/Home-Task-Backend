import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes";
import cors from "cors";
import morgan from "morgan";
import { corsConfig } from "./config/cors";

// DB
dotenv.config();
connectDB();

const app = express();
app.use(cors(corsConfig));
app.use(express.json());

// Logging
app.use(morgan("dev"));

// Routes
app.use("/api/projects", projectRoutes);

export default app;
