// @ts-nocheck (Disable TypeScript checking for this file)

import express from "express";
import {
  markAttendanceHandler,
  getUserAttendanceHandler,
  getTeamAttendanceHandler,
  getTeamWeeklyAttendanceHandler,
} from "../controller/attendanceController";

const router = express.Router();

router.post("/mark", markAttendanceHandler);
router.get("/user/:userId", getUserAttendanceHandler);
router.get("/team/:teamId/:date", getTeamAttendanceHandler);
router.get("/team/:teamId/weekly", getTeamWeeklyAttendanceHandler);

export default router;
