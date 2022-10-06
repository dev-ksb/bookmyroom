import mongoose from "mongoose";
import Room from "../models/room.js";
import rooms from "../data/rooms.json" assert { type: "json" };

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect("mongodb://localhost:27017/bookit");
};

dbConnect();

const seedRooms = async () => {
  try {
    await Room.deleteMany();
    console.log("Rooms are deleted");

    await Room.insertMany(rooms);
    console.log("All rooms are added");
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedRooms();
