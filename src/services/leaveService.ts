import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_LEAVE_TABLE || "";

export const submitLeaveRequest = async (
  employeeId: string,
  managerId: string,
  startDate: string,
  endDate: string,
  reason: string
) => {
  const leaveId = uuidv4();

  const today = new Date();
  const requestedDate = new Date(startDate);
  const timeDiff = requestedDate.getTime() - today.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);
  if (daysDiff < 2) {
    throw new Error(
      "Leave request must be submitted at least 2 days in advance."
    );
  }

  const leaveRequest = {
    LeaveId: leaveId,
    EmployeeId: employeeId,
    ManagerId: managerId,
    StartDate: startDate,
    EndDate: endDate,
    Reason: reason,
    Status: "Pending",
    CreatedAt: new Date().toISOString(),
  };

  await dynamoDB
    .put({
      TableName: TABLE_NAME,
      Item: leaveRequest,
    })
    .promise();

  return leaveRequest;
};

export const getAllLeaveRequests = async () => {
  const result = await dynamoDB.scan({ TableName: TABLE_NAME }).promise();
  return result.Items;
};

export const getLeaveRequestById = async (leaveId: string) => {
  const result = await dynamoDB
    .get({
      TableName: TABLE_NAME,
      Key: { LeaveId: leaveId },
    })
    .promise();

  return result.Item;
};

export const approveLeaveRequest = async (
  leaveId: string,
  approvedBy: string
) => {
  await dynamoDB
    .update({
      TableName: TABLE_NAME,
      Key: { LeaveId: leaveId },
      UpdateExpression: "SET #status = :status, ApprovedBy = :approvedBy",
      ExpressionAttributeNames: { "#status": "Status" },
      ExpressionAttributeValues: {
        ":status": "Approved",
        ":approvedBy": approvedBy,
      },
    })
    .promise();

  return { message: "Leave request approved" };
};

export const rejectLeaveRequest = async (
  leaveId: string,
  reason: string,
  rejectedBy: string
) => {
  await dynamoDB
    .update({
      TableName: TABLE_NAME,
      Key: { LeaveId: leaveId },
      UpdateExpression:
        "SET #status = :status, RejectedBy = :rejectedBy, RejectionReason = :reason",
      ExpressionAttributeNames: { "#status": "Status" },
      ExpressionAttributeValues: {
        ":status": "Rejected",
        ":rejectedBy": rejectedBy,
        ":reason": reason,
      },
    })
    .promise();

  return { message: "Leave request rejected" };
};

export const cancelLeaveRequest = async (
  leaveId: string,
  employeeId: string
) => {
  const leave = await getLeaveRequestById(leaveId);
  if (!leave) throw new Error("Leave request not found");

  if (leave.EmployeeId !== employeeId)
    throw new Error("You can only cancel your own leave request");

  if (leave.Status !== "Pending")
    throw new Error("Only pending leave requests can be canceled");

  await dynamoDB
    .delete({
      TableName: TABLE_NAME,
      Key: { LeaveId: leaveId },
    })
    .promise();

  return { message: "Leave request canceled successfully" };
};
