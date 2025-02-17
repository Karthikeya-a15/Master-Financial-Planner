import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/index.js";
import express from "express";

const app = express();
connectDB();