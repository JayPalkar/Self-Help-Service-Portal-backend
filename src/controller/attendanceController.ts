import { Request, Response } from "express";
import {
  markAttendance,
  getAttendanceByUser,
  getTeamAttendance,
  getTeamWeeklyAttendance,
} from "../services/attendanceService";

export const markAttendanceHandler = async (req: Request, res: Response) => {
  const { userId, teamId, status, date } = req.body;

  try {
    const attendance = await markAttendance(userId, teamId, status, date);
    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserAttendanceHandler = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const attendance = await getAttendanceByUser(userId);
    return res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeamAttendanceHandler = async (req: Request, res: Response) => {
  const { teamId, date } = req.params;

  try {
    const attendance = await getTeamAttendance(teamId, date);
    return res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeamWeeklyAttendanceHandler = async (
  req: Request,
  res: Response
) => {
  const { teamId } = req.params;

  try {
    const attendance = await getTeamWeeklyAttendance(teamId);
    return res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
