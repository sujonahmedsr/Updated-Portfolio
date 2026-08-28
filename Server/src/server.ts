import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";
import configOut from "./configOut";

let server: Server;

async function main() {
  try {
    await mongoose.connect(configOut.DBURL as string);

    server = app.listen(configOut.PORT, () => {
      console.log(`Server running on port ${configOut.PORT} 🏃🏽‍♂️‍➡️`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on("unhandledRejection", () => {
  console.log("unhandledRejection is detected, shutting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on("uncaughtException", () => {
  console.log("uncaughtException is detected, shutting down...");
  process.exit(1);
});