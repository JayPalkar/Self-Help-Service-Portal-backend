import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { getProjectColor } from "../utils/getProjectColor";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TASKS_TABLE = process.env.DYNAMODB_TASKS_TABLE || "";

export const createTask = async (
  teamId: string,
  projectId: string,
  title: string,
  description: string,
  assignedTo: string,
  priority: string,
  deadline: string
) => {
  const boardId = `${teamId}-board`;
  const taskId = uuidv4();

  const projectColor = await getProjectColor(projectId);

  const task = {
    TaskId: taskId,
    BoardId: boardId,
    ProjectId: projectId,
    ProjectColor: projectColor,
    Title: title,
    Description: description,
    AssignedTo: assignedTo,
    Priority: priority,
    Deadline: deadline,
    Status: "Ready",
  };

  await dynamoDB
    .put({
      TableName: TASKS_TABLE,
      Item: task,
    })
    .promise();

  return task;
};

export const getTasksByBoard = async (boardId: string) => {
  const result = await dynamoDB
    .query({
      TableName: TASKS_TABLE,
      IndexName: "BoardId-Index",
      KeyConditionExpression: "BoardId = :boardId",
      ExpressionAttributeValues: { ":boardId": boardId },
    })
    .promise();

  return result.Items || [];
};

export const getTasksByUser = async (userId: string) => {
  const result = await dynamoDB
    .query({
      TableName: TASKS_TABLE,
      IndexName: "AssignedTo-Index",
      KeyConditionExpression: "AssignedTo = :userId",
      ExpressionAttributeValues: { ":userId": userId },
    })
    .promise();

  return result.Items || [];
};

export const getTaskById = async (taskId: string) => {
  if (!taskId) throw new Error("Task ID is required");

  const result = await dynamoDB
    .query({
      TableName: TASKS_TABLE,
      IndexName: "TaskId-Index",
      KeyConditionExpression: "TaskId = :taskId",
      ExpressionAttributeValues: { ":taskId": taskId },
    })
    .promise();

  if (!result.Items || result.Items.length === 0) {
    throw new Error("Task not found");
  }

  return result.Items[0];
};

export const updateTask = async (taskId: string, updates: any) => {
  let updateExpression = "SET ";
  const expressionAttributeNames: any = {};
  const expressionAttributeValues: any = {};

  Object.entries(updates).forEach(([key, value], index) => {
    updateExpression += `#${key} = :${key}`;
    if (index < Object.entries(updates).length - 1) updateExpression += ", ";
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = value;
  });

  await dynamoDB
    .update({
      TableName: TASKS_TABLE,
      Key: { TaskId: taskId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    })
    .promise();

  return { TaskId: taskId, Updates: updates };
};
