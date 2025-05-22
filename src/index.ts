import express from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";

import { mongo, server } from "./config/config";
import { corsHandler } from "./middlewares/corsHandler";
import router from "./routes";
import swaggerSpecs from "./swagger";
import { authMock } from "./middlewares/authMock";

const app = express();
let databaseConnection: typeof mongoose;

console.log("-----------------------------------------------");
console.log("Initializing API");
console.log("-----------------------------------------------");
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  console.log("-----------------------------------------------");
  console.log("Connect to Mongo");
  console.log("-----------------------------------------------");
  console.log("Mongo Connection: ", mongo.MONGO_CONNECTION);
  mongoose
    .connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS)
    .then((connection) => {
      databaseConnection = connection;
      console.log("-----------------------------------------------");
      console.log("Connected to Mongo: ", databaseConnection.version);
      console.log("-----------------------------------------------");
    })
    .catch((error) => {
      console.log("Error connecting to DB: ", error);
    });
}

console.log("-----------------------------------------------");
console.log("Configuration");
console.log("-----------------------------------------------");
app.use(corsHandler);
app.use(authMock);

console.log("-----------------------------------------------");
console.log("Docs Config");
console.log("-----------------------------------------------");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

console.log("-----------------------------------------------");
console.log("Define Controllers Routing");
console.log("-----------------------------------------------");
app.get("/ping", (_, res) => {
  console.log("Pinged!");
  res.json("pong");
});
app.use(router);

console.log("-----------------------------------------------");
console.log("Start Server");
console.log("-----------------------------------------------");
const serverConnection = app.listen(server.SERVER_PORT, () => {
  console.log(`Server running on port: ${server.SERVER_PORT}`);
});

export { app, databaseConnection, serverConnection };
