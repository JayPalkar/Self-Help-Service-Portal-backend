import { DynamoDB } from "aws-sdk";
import { Attendance, createAttendance } from "../models/attendance";

const dynamoDB = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_ATTENDANCE_TABLE as string;

export const markAttendance = async (
  userId: string,
  teamId: string,
  status: "attended" | "missed",
  date: string
): Promise<Attendance> => {
  const attendance = createAttendance(userId, teamId, status, date);

  await dynamoDB
    .put({
      TableName: TABLE_NAME,
      Item: attendance,
    })
    .promise();

  return attendance;
};

export const getAttendanceByUser = async (userId: string) => {
  const result = await dynamoDB
    .query({
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    })
    .promise();

  return result.Items;
};

export const getTeamAttendance = async (teamId: string, date: string) => {
  const result = await dynamoDB
    .query({
      TableName: TABLE_NAME,
      KeyConditionExpression: "teamId = :teamId AND date = :date",
      ExpressionAttributeValues: {
        ":teamId": teamId,
        ":date": date,
      },
    })
    .promise();

  return result.Items;
};

export const getTeamWeeklyAttendance = async (teamId: string) => {
  const result = await dynamoDB
    .query({
      TableName: TABLE_NAME,
      KeyConditionExpression: "teamId = :teamId",
      ExpressionAttributeValues: {
        ":teamId": teamId,
      },
    })
    .promise();

  return result.Items;
};
