import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;


const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://noteapp:3rqKXiiHdOZklfir@cluster0.4nvaj.mongodb.net/tour-management-backend?retryWrites=true&w=majority&appName=Cluster0"
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

