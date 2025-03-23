import { Response } from "express";

const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE;

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const params = {
      TableName: USERS_TABLE,
    };

    const result = await dynamoDB.scan(params).promise();

    const employees = result.Items.filter((user: any) => user.role !== "Admin");

    return res.status(200).json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
