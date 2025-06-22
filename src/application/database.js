import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export default async function connectDatabase() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("connect database");
  } catch (error) {
    console.log("Error connect ", error.message);
    process.exit(1);
  }
}
