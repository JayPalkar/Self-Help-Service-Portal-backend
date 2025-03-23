// @ts-nocheck (Disable TypeScript checking for this file)

import express from "express";
import { getAllEmployees } from "../controller/employeeController";

const router = express.Router();

router.get("/", getAllEmployees);

export default router;
