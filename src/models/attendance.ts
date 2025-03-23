import { v4 as uuidv4 } from "uuid";

export interface Attendance {
  userId: string;
  teamId: string;
  date: string;
  status: "attended" | "missed";
  missedCount: number;
}

export const createAttendance = (
  userId: string,
  teamId: string,
  status: "attended" | "missed",
  date: string
): Attendance => {
  return {
    userId,
    teamId,
    date,
    status,
    missedCount: status === "missed" ? 1 : 0,
  };
};
