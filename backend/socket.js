import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import ChatMessage from "./models/chat-app/ChatMessage.js";
import RoomMember from "./models/chat-app/RoomMembers.js";
import User from "./models/User.js";

export default function initializeSocket(server) {
  const io = new Server(server, { cors: { origin: "*" } });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      console.log(err.message);
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {

    socket.on("joinRoom", async ({ roomId, page = 1, limit = 20 }) => {
      try {
        socket.join(roomId);
        
        const isMember = await RoomMember.findOne({ roomId, userId: socket.userId });
        if (!isMember) {
          await RoomMember.create({ roomId, userId: socket.userId });
        }

        const skip = (page - 1) * limit;
        const messages = await ChatMessage.find({ roomId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
        socket.emit("previousMessages", messages.reverse());
      } catch (error) {
        console.error("Error in joinRoom:", error);
        socket.emit("error", { message: "Failed to load messages" });
      }
    });

    socket.on("sendMessage", async ({ roomId, message, attachment }) => {
      try {
        const user = await User.findById(socket.userId);
        const newMessage = await ChatMessage.create({
          roomId,
          senderId: socket.userId,
          senderName : user.name,
          message,
          attachment: attachment || null,
          createdAt: new Date(),
        });
        io.to(roomId).emit("newMessage", newMessage);
      } catch (error) {
        console.error("Error in sendMessage:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId);
    });
  });

  return io;
}