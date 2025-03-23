import AWS from "aws-sdk";
import { getProjectColor } from "../utils/getProjectColor";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const BOARD_TABLE = process.env.DYNAMODB_PRIORITY_BOARDS_TABLE || "";

export const createPriorityBoard = async (
  teamId: string,
  projectId: string
) => {
  const projectColor = await getProjectColor(projectId);

  const boardId = `${teamId}-board`;

  await dynamoDB
    .put({
      TableName: BOARD_TABLE,
      Item: {
        BoardId: boardId,
        TeamId: teamId,
        ProjectId: projectId,
        ProjectColor: projectColor,
      },
    })
    .promise();

  return {
    BoardId: boardId,
    TeamId: teamId,
    ProjectId: projectId,
    ProjectColor: projectColor,
  };
};

export const getPriorityBoardByTeam = async (teamId: string) => {
  const boardId = `${teamId}-board`;

  const result = await dynamoDB
    .get({
      TableName: BOARD_TABLE,
      Key: { BoardId: boardId },
    })
    .promise();

  return result.Item;
};
