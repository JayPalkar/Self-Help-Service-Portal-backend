import { Request, Response } from "express";
import {
  requestDocument,
  uploadDocumentToS3,
  approveDocument,
  rejectDocument,
  getPendingRequests,
  getDocumentById,
} from "../services/documentService";
import { successResponse, errorResponse } from "../utils/responseHelper";
import { getCognitoUserId } from "../services/userService";

/** ✅ Employee requests a document */
export const requestDocumentHandler = async (req: Request, res: Response) => {
  try {
    const { documentType } = req.body;
    const employeeId = await getCognitoUserId(req.cookies.accessToken); // 🔍 Extract user from accessToken

    const request = await requestDocument(employeeId, documentType);
    return successResponse(
      res,
      201,
      "Document request submitted successfully",
      request
    );
  } catch (error: any) {
    return errorResponse(res, error);
  }
};

/** ✅ Admin uploads document & approves request */
export const uploadDocumentHandler = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    const adminId = await getCognitoUserId(req.cookies.accessToken);
    const file = req.body.file; // 🔍 File should be sent as Base64 in request body

    if (!file) {
      return errorResponse(res, "No file provided", 400);
    }

    // Convert Base64 to Buffer
    const fileBuffer = Buffer.from(file, "base64");
    const fileName = `document_${requestId}.pdf`;

    // Upload file to S3
    const fileUrl = await uploadDocumentToS3(fileBuffer, fileName);

    // Approve document request in DynamoDB
    await approveDocument(requestId, fileUrl, adminId);

    return successResponse(res, 200, "Document issued successfully", {
      fileUrl,
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

/** ✅ Admin rejects a document request */
export const rejectDocumentHandler = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) throw new Error("Rejection reason is required");

    await rejectDocument(requestId, rejectionReason);
    return successResponse(res, 200, "Document request rejected");
  } catch (error) {
    return errorResponse(res, error);
  }
};

/** ✅ Admin views all pending requests */
export const getPendingRequestsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const requests = await getPendingRequests();
    return successResponse(
      res,
      200,
      "Pending document requests fetched successfully",
      requests
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

/** ✅ Employee views their document */
export const getDocumentHandler = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const document = await getDocumentById(requestId);
    if (!document) return errorResponse(res, "Document not found", 404);

    return successResponse(res, 200, "Document fetched successfully", document);
  } catch (error) {
    return errorResponse(res, error);
  }
};
