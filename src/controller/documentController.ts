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

export const requestDocumentHandler = async (req: Request, res: Response) => {
  try {
    const { documentType } = req.body;
    const employeeId = await getCognitoUserId(req.cookies.accessToken);
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

export const uploadDocumentHandler = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    const adminId = await getCognitoUserId(req.cookies.accessToken);
    const file = req.body.file;
    if (!file) {
      return errorResponse(res, "No file provided", 400);
    }

    const fileBuffer = Buffer.from(file, "base64");
    const fileName = `document_${requestId}.pdf`;

    const fileUrl = await uploadDocumentToS3(fileBuffer, fileName);

    await approveDocument(requestId, fileUrl, adminId);

    return successResponse(res, 200, "Document issued successfully", {
      fileUrl,
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

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
