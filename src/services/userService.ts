import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_USERS_TABLE || "";

export const saveUserDetails = async (
  cognitoUserId: string,
  role: string,
  dob: string,
  joiningDate: string,
  upiId: string
) => {
  await dynamoDB
    .put({
      TableName: TABLE_NAME,
      Item: {
        CognitoUserId: cognitoUserId,
        Role: role,
        DOB: dob,
        JoiningDate: joiningDate,
        UPI_ID: upiId,
      },
    })
    .promise();
};
