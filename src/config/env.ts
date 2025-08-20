import dotenv from "dotenv"
dotenv.config()

export const env = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.MONGO_URL,
};