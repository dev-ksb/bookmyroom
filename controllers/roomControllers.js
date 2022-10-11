import Room from "@/models/room";
import cacheAsyncErrors from "middlewares/cacheAsyncErrors";
import ErrorHandler from "utils/errorHandler";
import APIFeatures from "utils/apiFeatures";

const allRooms = cacheAsyncErrors(async (req, res) => {
  const resultPerPage = 5;
  const roomsCount = await Room.countDocuments();

  const apiFeatures = new APIFeatures(Room.find(), req.query).search().filter();
  let rooms = await apiFeatures.query;

  let filteredRoomsCount = rooms.length;

  apiFeatures.pagination(resultPerPage);

  rooms = await apiFeatures.query.clone();

  res.status(200).json({
    success: true,
    roomsCount,
    resultPerPage,
    filteredRoomsCount,
    rooms,
  });
});

const newRoom = cacheAsyncErrors(async (req, res) => {
  const room = await Room.create(req.body);
  res.status(201).json({
    success: true,
    room,
  });
});

const getSingleRoom = cacheAsyncErrors(async (req, res, next) => {
  const room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler("Room not found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    room,
  });
});

const updateRoom = cacheAsyncErrors(async (req, res, next) => {
  let room = await Room.findById(req.query.id);

  if (!room) return next(new ErrorHandler("Room not found with this ID", 400));

  room = await Room.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    room,
  });
});

const deleteRoom = cacheAsyncErrors(async (req, res, next) => {
  const room = await Room.findById(req.query.id);

  if (!room) return next(new ErrorHandler("Room not found with this ID", 404));

  await room.remove();

  res.status(200).json({
    success: true,
    message: "Room is deleted.",
  });
});

export { allRooms, newRoom, getSingleRoom, updateRoom, deleteRoom };
