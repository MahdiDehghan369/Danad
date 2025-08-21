import dotenv from "dotenv"
dotenv.config()

export const env = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.MONGO_URL,
  JWT: {
    ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
    ACCESS_TOKEN_EXPIRE_IN: process.env.ACCESS_TOKEN_EXPIRE_IN,
    REFRESH_TOKEN_EXPIRE_IN: process.env.REFRESH_TOKEN_EXPIRE_IN,
  },
};