import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const PROJECTS_TABLE = process.env.DYNAMODB_PROJECTS_TABLE || "";

export const getProjectColor = async (projectId: string) => {
  const result = await dynamoDB
    .get({
      TableName: PROJECTS_TABLE,
      Key: { ProjectId: projectId },
    })
    .promise();

  return result.Item?.ProjectColor || "#000000";
};
