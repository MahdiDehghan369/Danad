import mongoose from "mongoose";
import { env } from "./env";

export async function connectToDatabase() {
  try {
    await mongoose.connect(env.DATABASE_URL as string);
    console.log(`Connected to database successfully :)`);
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }
}
