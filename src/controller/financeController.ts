import { Request, Response } from "express";
import {
  distributeStipend,
  markAsPaid,
  confirmCheckIn,
  getAllFinanceRecords,
  getMonthlyReport,
  getEmployeePaymentHistory,
  getPendingPayments,
} from "../services/financeService";
import { successResponse, errorResponse } from "../utils/responseHelper";
import { getCognitoUserId, getUserRole } from "../services/userService";

// ✅ Admin can distribute stipends/salaries
export const distributeStipendHandler = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;
    const adminId = await getCognitoUserId(accessToken);
    const role = await getUserRole(adminId);

    if (role !== "Admin") {
      return errorResponse(res, "Only Admins can manage stipends.", 403);
    }

    const { employeeId, amount } = req.body;
    const record = await distributeStipend(employeeId, amount, adminId);
    return successResponse(res, 201, "Stipend recorded successfully", record);
  } catch (error) {
    return errorResponse(res, error);
  }
};

// ✅ Admin can mark stipend as paid
export const markAsPaidHandler = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;
    const adminId = await getCognitoUserId(accessToken);
    const role = await getUserRole(adminId);

    if (role !== "Admin") {
      return errorResponse(res, "Only Admins can mark payments as paid.", 403);
    }

    const { id } = req.params;
    await markAsPaid(id, adminId);
    return successResponse(res, 200, "Stipend marked as paid");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// ✅ Admin can confirm manual check-in
export const confirmCheckInHandler = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;
    const adminId = await getCognitoUserId(accessToken);
    const role = await getUserRole(adminId);

    if (role !== "Admin") {
      return errorResponse(
        res,
        "Only Admins can confirm manual check-ins.",
        403
      );
    }

    const { id } = req.params;
    await confirmCheckIn(id);
    return successResponse(res, 200, "Manual check-in confirmed");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// ✅ Admin can get all finance records
export const getAllFinanceRecordsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const accessToken = req.cookies.accessToken;
    const adminId = await getCognitoUserId(accessToken);
    const role = await getUserRole(adminId);
    if (role !== "Admin") {
      return errorResponse(res, "Only Admins can view financial records.", 403);
    }

    const records = await getAllFinanceRecords();
    return successResponse(
      res,
      200,
      "Financial records fetched successfully",
      records
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

// ✅ Admin can get all pending payments
export const getPendingPaymentsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const accessToken = req.cookies.accessToken;
    const adminId = await getCognitoUserId(accessToken);
    const role = await getUserRole(adminId);
    if (role !== "Admin") {
      return errorResponse(res, "Only Admins can view pending payments.", 403);
    }

    const pendingPayments = await getPendingPayments();
    return successResponse(
      res,
      200,
      "Pending payments fetched successfully",
      pendingPayments
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

// ✅ Admin can track total payments made to an employee
export const getEmployeePaymentHistoryHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const accessToken = req.cookies.accessToken;
    const adminId = await getCognitoUserId(accessToken);
    const role = await getUserRole(adminId);
    if (role !== "Admin") {
      return errorResponse(
        res,
        "Only Admins can view employee payment history.",
        403
      );
    }

    const { employeeId } = req.params;
    const history = await getEmployeePaymentHistory(employeeId);
    return successResponse(
      res,
      200,
      "Employee payment history fetched successfully",
      history
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

// ✅ Admin can get a report for a specific month
export const getMonthlyReportHandler = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;
    const adminId = await getCognitoUserId(accessToken);
    const role = await getUserRole(adminId);
    if (role !== "Admin") {
      return errorResponse(res, "Only Admins can view financial reports.", 403);
    }

    const { monthYear } = req.params;
    const report = await getMonthlyReport(monthYear);
    return successResponse(
      res,
      200,
      "Monthly finance report generated",
      report
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};
