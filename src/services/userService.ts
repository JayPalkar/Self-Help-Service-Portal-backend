import AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider();
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

export const getCognitoUserId = async (
  accessToken: string
): Promise<string> => {
  try {
    const response = await cognito
      .getUser({ AccessToken: accessToken })
      .promise();
    const userId = response.UserAttributes?.find(
      (attr) => attr.Name === "email"
    )?.Value;

    if (!userId) throw new Error("User ID not found in Cognito");

    return userId;
  } catch (error) {
    console.error("Error fetching Cognito User ID:", error);
    throw new Error("Unauthorized. Invalid access token.");
  }
};

export const getUserRole = async (email: string): Promise<string | null> => {
  const result = await dynamoDB
    .get({
      TableName: TABLE_NAME,
      Key: { CognitoUserId: email },
      ProjectionExpression: "#role",
      ExpressionAttributeNames: { "#role": "Role" },
    })
    .promise();

  return result.Item?.Role || null;
};
