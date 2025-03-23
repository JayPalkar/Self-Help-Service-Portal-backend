import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_FINANCE_TABLE || "";

// ✅ Record stipend/salary distribution
export const distributeStipend = async (
  employeeId: string,
  amount: number,
  paidBy: string
) => {
  const transactionId = uuidv4();
  const monthYear = new Date().toISOString().slice(0, 7); // YYYY-MM format

  const record = {
    TransactionId: transactionId,
    EmployeeId: employeeId,
    Amount: amount,
    Status: "Pending",
    PaidBy: paidBy,
    PaidOn: null,
    CheckedIn: false,
    MonthYear: monthYear,
  };

  await dynamoDB
    .put({
      TableName: TABLE_NAME,
      Item: record,
    })
    .promise();

  return record;
};

// ✅ Mark stipend/salary as paid
export const markAsPaid = async (transactionId: string, paidBy: string) => {
  if (!transactionId) {
    throw new Error("TransactionId is required.");
  }

  console.log(transactionId);

  // Check if transaction exists
  const transaction = await dynamoDB
    .get({
      TableName: TABLE_NAME,
      Key: { TransactionId: transactionId },
    })
    .promise();

  if (!transaction.Item) {
    throw new Error("Transaction not found.");
  }

  const paidOn = new Date().toISOString();

  await dynamoDB
    .update({
      TableName: TABLE_NAME,
      Key: { TransactionId: transactionId },
      UpdateExpression:
        "SET #status = :status, PaidBy = :paidBy, PaidOn = :paidOn",
      ExpressionAttributeNames: { "#status": "Status" }, // ✅ Fix reserved keyword
      ExpressionAttributeValues: {
        ":status": "Paid",
        ":paidBy": paidBy,
        ":paidOn": paidOn,
      },
    })
    .promise();

  return { message: "Stipend marked as paid" };
};

// ✅ Confirm manual check-in
export const confirmCheckIn = async (transactionId: string) => {
  await dynamoDB
    .update({
      TableName: TABLE_NAME,
      Key: { TransactionId: transactionId },
      UpdateExpression: "SET CheckedIn = :checkedIn",
      ExpressionAttributeValues: { ":checkedIn": true },
    })
    .promise();

  return { message: "Manual check-in confirmed" };
};

// ✅ Get all financial records
export const getAllFinanceRecords = async () => {
  const result = await dynamoDB.scan({ TableName: TABLE_NAME }).promise();
  return result.Items;
};

// ✅ Get all pending payments
export const getPendingPayments = async () => {
  const result = await dynamoDB
    .scan({
      TableName: TABLE_NAME,
      FilterExpression: "#status = :pending",
      ExpressionAttributeNames: { "#status": "Status" },
      ExpressionAttributeValues: { ":pending": "Pending" },
    })
    .promise();

  return result.Items;
};

// ✅ Get total payments made to an employee over time
export const getEmployeePaymentHistory = async (employeeId: string) => {
  const result = await dynamoDB
    .query({
      TableName: TABLE_NAME,
      IndexName: "EmployeeId-MonthYear-Index",
      KeyConditionExpression: "EmployeeId = :employeeId",
      ExpressionAttributeValues: { ":employeeId": employeeId },
    })
    .promise();

  const totalPaid = result.Items?.reduce((sum, record) => {
    return record.Status === "Paid" ? sum + record.Amount : sum;
  }, 0);

  return {
    employeeId,
    totalPaid,
    transactions: result.Items || [],
  };
};

// ✅ Get aggregated report for a specific month
export const getMonthlyReport = async (monthYear: string) => {
  const result = await dynamoDB
    .query({
      TableName: TABLE_NAME,
      IndexName: "MonthYearIndex", // Assuming a GSI for MonthYear
      KeyConditionExpression: "MonthYear = :monthYear",
      ExpressionAttributeValues: { ":monthYear": monthYear },
    })
    .promise();

  const totalAmount =
    result.Items?.reduce((sum, record) => sum + record.Amount, 0) || 0;

  return {
    monthYear,
    totalAmount,
    transactions: result.Items || [],
  };
};
