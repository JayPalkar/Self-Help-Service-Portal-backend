import { Request, Response } from "express";
import {
  submitLeaveRequest,
  getAllLeaveRequests,
  getLeaveRequestById,
  approveLeaveRequest,
  rejectLeaveRequest,
  cancelLeaveRequest,
} from "../services/leaveService";
import { successResponse, errorResponse } from "../utils/responseHelper";
import { getCognitoUserId, getUserRole } from "../services/userService";

export const submitLeaveRequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const accessToken = req.cookies.accessToken;
    const employeeId = await getCognitoUserId(accessToken);
    const role = await getUserRole(accessToken);

    if (role == "Admin") {
      return errorResponse(res, "Admin can not submit leave requests.", 403);
    }

    const { managerId, startDate, endDate, reason } = req.body;
    const leaveRequest = await submitLeaveRequest(
      employeeId,
      managerId,
      startDate,
      endDate,
      reason
    );
    return successResponse(
      res,
      201,
      "Leave request submitted successfully",
      leaveRequest
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getAllLeaveRequestsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const accessToken = req.cookies.accessToken;
    const createdBy = await getCognitoUserId(accessToken);

    if (!createdBy) {
      return errorResponse(res, "Unauthorized. Invalid access token.", 401);
    }

    const role = await getUserRole(createdBy);
    if (role !== "Manager" && role !== "Admin") {
      return errorResponse(res, "Only Managers can view leave requests.", 403);
    }

    const leaves = await getAllLeaveRequests();
    return successResponse(
      res,
      200,
      "Leave requests fetched successfully",
      leaves
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getLeaveRequestByIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const leave = await getLeaveRequestById(id);

    if (!leave) return errorResponse(res, "Leave request not found", 404);

    return successResponse(
      res,
      200,
      "Leave request fetched successfully",
      leave
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const approveLeaveRequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const accessToken = req.cookies.accessToken;
    const createdBy = await getCognitoUserId(accessToken);

    if (!createdBy) {
      return errorResponse(res, "Unauthorized. Invalid access token.", 401);
    }

    const role = await getUserRole(createdBy);
    if (role !== "Manager" && role !== "Admin") {
      return errorResponse(
        res,
        "Only Managers can approve leave requests.",
        403
      );
    }

    const { id } = req.params;
    await approveLeaveRequest(id, createdBy);
    return successResponse(res, 200, "Leave request approved successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const rejectLeaveRequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const accessToken = req.cookies.accessToken;
    const createdBy = await getCognitoUserId(accessToken);

    if (!createdBy) {
      return errorResponse(res, "Unauthorized. Invalid access token.", 401);
    }

    const role = await getUserRole(createdBy);
    if (role !== "Manager" && role !== "Admin") {
      return errorResponse(
        res,
        "Only Managers can reject leave requests.",
        403
      );
    }

    const { id } = req.params;
    const { reason } = req.body;
    await rejectLeaveRequest(id, reason, createdBy);
    return successResponse(res, 200, "Leave request rejected successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const cancelLeaveRequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const accessToken = req.cookies.accessToken;
    const employeeId = await getCognitoUserId(accessToken);

    const { id } = req.params;
    await cancelLeaveRequest(id, employeeId);
    return successResponse(res, 200, "Leave request canceled successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};
