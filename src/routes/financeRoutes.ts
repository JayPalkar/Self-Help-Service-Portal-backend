// @ts-nocheck (Disable TypeScript checking for this file)

import express from "express";
import {
  distributeStipendHandler,
  markAsPaidHandler,
  confirmCheckInHandler,
  getAllFinanceRecordsHandler,
  getMonthlyReportHandler,
  getPendingPaymentsHandler,
  getEmployeePaymentHistoryHandler,
} from "../controller/financeController";

const router = express.Router();

router.post("/distribute", distributeStipendHandler);
router.put("/:id/mark-paid", markAsPaidHandler);
router.put("/:id/check-in", confirmCheckInHandler);
router.get("/", getAllFinanceRecordsHandler);
router.get("/report/:monthYear", getMonthlyReportHandler);
router.get("/pending", getPendingPaymentsHandler);
router.get("/history/:employeeId", getEmployeePaymentHistoryHandler);

export default router;
