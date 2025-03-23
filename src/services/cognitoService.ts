import AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider();
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || "";
const CLIENT_ID = process.env.COGNITO_CLIENT_ID || "";

export const addUserToGroup = async (email: string, groupName: string) => {
  try {
    await cognito
      .adminAddUserToGroup({
        UserPoolId: USER_POOL_ID,
        Username: email,
        GroupName: groupName,
      })
      .promise();

    console.log(`✅ Added ${email} to ${groupName} group`);
  } catch (error) {
    console.error(`❌ Failed to add ${email} to ${groupName} group:`, error);
    throw error;
  }
};

export const getUserGroups = async (email: string): Promise<string[]> => {
  try {
    const response = await cognito
      .adminListGroupsForUser({
        UserPoolId: USER_POOL_ID,
        Username: email,
      })
      .promise();

    return (
      response.Groups?.map((group) => group.GroupName).filter(
        (name): name is string => !!name
      ) || []
    );
  } catch (error) {
    console.error(`❌ Failed to get groups for ${email}:`, error);
    return [];
  }
};

export const createUserInCognito = async (
  email: string,
  password: string,
  role: string
) => {
  await cognito
    .adminCreateUser({
      UserPoolId: USER_POOL_ID,
      Username: email,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "email_verified", Value: "true" },
      ],
      MessageAction: "SUPPRESS",
    })
    .promise();

  await cognito
    .adminSetUserPassword({
      UserPoolId: USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: true,
    })
    .promise();

  // ✅ If role is "Admin", add user to the "Admin" group
  if (role === "Admin") {
    await addUserToGroup(email, "Admin");
  }

  return { CognitoUserId: email, Email: email };
};

export const getUserFromCognito = async (email: string) => {
  try {
    const user = await cognito
      .adminGetUser({
        UserPoolId: USER_POOL_ID,
        Username: email,
      })
      .promise();

    return user;
  } catch (error: any) {
    if (error.code === "UserNotFoundException") {
      return null;
    }
    throw error;
  }
};

export const authenticateUser = async (email: string, password: string) => {
  const response = await cognito
    .initiateAuth({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    })
    .promise();

  return response.AuthenticationResult;
};

export const globalSignOut = async (accessToken: string) => {
  try {
    console.log("Signing out with Access Token:", accessToken);
    await cognito
      .globalSignOut({
        AccessToken: accessToken,
      })
      .promise();

    console.log("User successfully signed out from Cognito.");
  } catch (error) {
    console.error("Cognito Logout Error:", error);
    throw new Error("Invalid Access Token or User already signed out");
  }
};
