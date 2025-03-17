import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./db/index.js";
import userRouter from "./routes/user.js"
import netWorthRouter from "./routes/netWorth.js"
import plannerRouter from "./routes/planner.js"
import toolsRouter from "./routes/tools.js"
import adminRouter from "./routes/admin.js"
import realTimeRouter from "./routes/realtime.js";
import creditRouter from "./routes/creditcard.js";

import http from "http";
import initializeSocket from "./socket.js";

const app = express();

app.use(
    cors({
      origin: "http://localhost:5173/",
      methods: "GET,POST,PUT,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    })
  );
connectDB();

app.use(cors());

app.use(express.json());

const server = http.createServer(app);

initializeSocket(server);

app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next(); 
});

app.use("/api/v1/user",userRouter);
app.use("/api/v1/networth",netWorthRouter);
app.use("/api/v1/realtime", realTimeRouter);
app.use("/api/v1/planner", plannerRouter);
app.use("/api/v1/tools",toolsRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/creditcard",creditRouter);

server.listen(process.env.PORT,() => {
    console.log(`The app is running on port ${process.env.PORT}`);
});
