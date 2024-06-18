import mongoose from "mongoose";
import { exit } from "node:process";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);

    const url = `${connection.connection.host}:${connection.connection.port}`;
  } catch (error) {
    console.log("Error to connect - DB");
    exit(1);
  }
};
