import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { promise } from "zod";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://noteapp:3rqKXiiHdOZklfir@cluster0.4nvaj.mongodb.net/ph-tour-management?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log("Connected to db");

    server = app.listen(5000, () => {
      console.log("server is running on port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

//1. unhandled rejecton error
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shutting down", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

//2. uncaught rejection error
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

//3. signal termination (sigterm)
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... Server shutting down");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});


//extra for ourself , when we need to  shoutdown the server manually
process.on("SIGINT", () => {
  console.log("SIGINT signal received... Server shutting down");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// example 1:
// Promise.reject(new Error ("I forgot to catch this promise"))

// example 2:
// throw new Error("I forgot to handle this local error");

/**
 * *Errors*
 * 1. unhandled rejecton error
 * 2. uncaught rejection error
 * 3. signal termination (sigterm)
 */
