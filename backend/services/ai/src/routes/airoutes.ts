import express from "express";
import { generateproject } from "../controller/aicontroller.js";

const airouter = express.Router();
airouter.post("/generate", generateproject);

export { airouter };