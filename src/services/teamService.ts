import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TEAMS_TABLE || "";

export const createTeam = async (
  name: string,
  headId: string,
  createdBy: string
) => {
  const teamId = uuidv4();

  const team = {
    teamId: teamId,
    Name: name,
    HeadId: headId,
    CreatedBy: createdBy,
    Members: [],
    CreatedAt: new Date().toISOString(),
  };

  await dynamoDB
    .put({
      TableName: TABLE_NAME,
      Item: team,
    })
    .promise();

  return team;
};

export const getAllTeams = async () => {
  const result = await dynamoDB.scan({ TableName: TABLE_NAME }).promise();
  return result.Items;
};

export const getTeamById = async (teamId: string) => {
  const result = await dynamoDB
    .get({
      TableName: TABLE_NAME,
      Key: { teamId: teamId },
    })
    .promise();

  return result.Item;
};
export const updateTeam = async (
  teamId: string,
  name?: string,
  headId?: string,
  membersToAdd?: string[]
) => {
  const updateExpressions = [];
  const expressionAttributeValues: Record<string, any> = {};
  const expressionAttributeNames: Record<string, string> = {};

  if (name) {
    updateExpressions.push("#name = :name");
    expressionAttributeValues[":name"] = name;
    expressionAttributeNames["#name"] = "Name";
  }

  if (headId) {
    updateExpressions.push("HeadId = :headId");
    expressionAttributeValues[":headId"] = headId;
  }

  if (membersToAdd && membersToAdd.length > 0) {
    updateExpressions.push("Members = list_append(Members, :membersToAdd)");
    expressionAttributeValues[":membersToAdd"] = membersToAdd;
  }

  if (updateExpressions.length === 0) {
    throw new Error("No valid fields to update.");
  }

  await dynamoDB
    .update({
      TableName: TABLE_NAME,
      Key: { teamId: teamId },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
    })
    .promise();

  return { message: "Team updated successfully" };
};

export const deleteTeam = async (teamId: string) => {
  await dynamoDB
    .delete({
      TableName: TABLE_NAME,
      Key: { teamId: teamId },
    })
    .promise();

  return { message: "Team deleted successfully" };
};
