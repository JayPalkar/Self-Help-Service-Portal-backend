import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const TABLE_NAME = process.env.DYNAMODB_DOCUMENTS_TABLE || "";
const BUCKET_NAME = process.env.S3_BUCKET_NAME || "";

/** ✅ Create a new document request (Employee Request) */
export const requestDocument = async (
  employeeId: string,
  documentType: string
) => {
  const requestId = uuidv4();
  const request = {
    RequestId: requestId,
    EmployeeId: employeeId,
    DocumentType: documentType,
    Status: "Pending",
    FileURL: null,
    IssuedBy: null,
    IssuedOn: null,
    RejectionReason: null,
  };

  await dynamoDB.put({ TableName: TABLE_NAME, Item: request }).promise();
  return request;
};

/** ✅ Upload document to S3 */
export const uploadDocumentToS3 = async (
  fileBuffer: Buffer,
  fileName: string
) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `documents/${fileName}`,
    Body: fileBuffer,
    ContentType: "application/pdf",
  };

  const result = await s3.upload(params).promise();
  return result.Location; // ✅ Returns S3 file URL
};

/** ✅ Approve document request (Admin Action) */
export const approveDocument = async (
  requestId: string,
  fileUrl: string,
  issuedBy: string
) => {
  await dynamoDB
    .update({
      TableName: TABLE_NAME,
      Key: { RequestId: requestId },
      UpdateExpression:
        "SET #status = :status, FileURL = :fileUrl, IssuedBy = :issuedBy, IssuedOn = :issuedOn",
      ExpressionAttributeNames: { "#status": "Status" },
      ExpressionAttributeValues: {
        ":status": "Approved",
        ":fileUrl": fileUrl,
        ":issuedBy": issuedBy,
        ":issuedOn": new Date().toISOString(),
      },
    })
    .promise();
};

/** ✅ Reject document request (Admin Action) */
export const rejectDocument = async (
  requestId: string,
  rejectionReason: string
) => {
  await dynamoDB
    .update({
      TableName: TABLE_NAME,
      Key: { RequestId: requestId },
      UpdateExpression: "SET #status = :status, RejectionReason = :reason",
      ExpressionAttributeNames: { "#status": "Status" },
      ExpressionAttributeValues: {
        ":status": "Rejected",
        ":reason": rejectionReason,
      },
    })
    .promise();
};

/** ✅ Fetch all pending document requests (Admin View) */
export const getPendingRequests = async () => {
  const result = await dynamoDB
    .scan({
      TableName: TABLE_NAME,
      FilterExpression: "#status = :status",
      ExpressionAttributeNames: { "#status": "Status" },
      ExpressionAttributeValues: { ":status": "Pending" },
    })
    .promise();

  return result.Items;
};

/** ✅ Get document details by RequestId */
export const getDocumentById = async (requestId: string) => {
  const result = await dynamoDB
    .get({ TableName: TABLE_NAME, Key: { RequestId: requestId } })
    .promise();
  return result.Item;
};
