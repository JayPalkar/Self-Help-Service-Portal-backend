import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDB = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_PROJECTS_TABLE || "Projects";

export const createProject = async (
  name: string,
  description: string,
  createdBy: string,
  assignedTeams: string[],
  projectColor: string
) => {
  const projectId = uuidv4();

  const project = {
    ProjectId: projectId,
    Name: name,
    Description: description,
    CreatedBy: createdBy,
    AssignedTeams: assignedTeams,
    ProjectColor: projectColor,
    CreatedAt: new Date().toISOString(),
  };

  await dynamoDB
    .put({
      TableName: TABLE_NAME,
      Item: project,
    })
    .promise();

  return project;
};

export const getProjectById = async (projectId: string) => {
  const result = await dynamoDB
    .get({
      TableName: TABLE_NAME,
      Key: { ProjectId: projectId },
    })
    .promise();

  return result.Item;
};

export const getAllProjects = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    return result.Items;
  } catch (error: any) {
    throw new Error("Error fetching projects: " + error.message);
  }
};

export const updateProject = async (
  projectId: string,
  name?: string,
  description?: string,
  assignedTeams?: string[],
  projectColor?: string
) => {
  const updateExpressions = [];
  const expressionAttributeValues: Record<string, any> = {};
  const expressionAttributeNames: Record<string, string> = {};

  if (name) {
    updateExpressions.push("#name = :name");
    expressionAttributeValues[":name"] = name;
    expressionAttributeNames["#name"] = "Name";
  }

  if (description) {
    updateExpressions.push("Description = :description");
    expressionAttributeValues[":description"] = description;
  }

  if (assignedTeams) {
    updateExpressions.push("AssignedTeams = :assignedTeams");
    expressionAttributeValues[":assignedTeams"] = assignedTeams;
  }

  if (projectColor) {
    updateExpressions.push("ProjectColor = :projectColor");
    expressionAttributeValues[":projectColor"] = projectColor;
  }

  if (updateExpressions.length === 0) {
    throw new Error("No valid fields to update.");
  }

  await dynamoDB
    .update({
      TableName: "Projects",
      Key: { ProjectId: projectId },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
    })
    .promise();

  return { message: "Project updated successfully" };
};

export const deleteProject = async (projectId: string) => {
  await dynamoDB
    .delete({
      TableName: TABLE_NAME,
      Key: { ProjectId: projectId },
    })
    .promise();

  return { message: "Project deleted successfully" };
};
