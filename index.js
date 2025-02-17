import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./db/index.js";
import userRouter from "./routes/user.js"
const app = express();

connectDB();

app.use(express.json());
app.use("/api/v1/user",userRouter);

app.listen(process.env.PORT,() => {
    console.log(`The app is running on port ${process.env.PORT}`);
})