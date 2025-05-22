import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

export const DEVELOPMENT = process.env.NODE_ENV === "development";
export const TEST = process.env.NODE_ENV === "test";

const MONGO_USER = process.env.MONGO_DB_ROOT_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_DB_ROOT_PASSWORD || "";
const MONGO_PORT = process.env.MONGO_DB_PORT || "27017";
const MONGO_URL = process.env.MONGO_DB_URL || "";
const MONGO_DATABASE = process.env.MONGO_DB_NAME || "";
const MONGO_OPTIONS: mongoose.ConnectOptions = {
  directConnection: true,
  retryWrites: true,
  w: "majority",
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 3000;

export const mongo = {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_URL,
  MONGO_DATABASE,
  MONGO_OPTIONS,
  //   MONGO_CONNECTION: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}/${MONGO_DATABASE}`,
  MONGO_CONNECTION: `mongodb://${MONGO_URL}:${MONGO_PORT}/${MONGO_DATABASE}`,
};

export const server = {
  SERVER_HOSTNAME,
  SERVER_PORT,
};
