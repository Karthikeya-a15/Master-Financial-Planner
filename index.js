import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./db/index.js";
import userRouter from "./routes/user.js"
import netWorthRouter from "./routes/netWorth.js"

const app = express();

connectDB();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next(); 
});


app.use("/api/v1/user",userRouter);
app.use("/api/v1/networth",netWorthRouter);

app.listen(process.env.PORT,() => {
    console.log(`The app is running on port ${process.env.PORT}`);
});
