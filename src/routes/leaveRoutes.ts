// @ts-nocheck (Disable TypeScript checking for this file)

import express from "express";
import {
  submitLeaveRequestHandler,
  getAllLeaveRequestsHandler,
  getLeaveRequestByIdHandler,
  approveLeaveRequestHandler,
  rejectLeaveRequestHandler,
  cancelLeaveRequestHandler,
} from "../controller/leaveController";

const router = express.Router();

router.post("/request", submitLeaveRequestHandler);
router.get("/", getAllLeaveRequestsHandler);
router.get("/:id", getLeaveRequestByIdHandler);
router.put("/:id/approve", approveLeaveRequestHandler);
router.put("/:id/reject", rejectLeaveRequestHandler);
router.delete("/:id", cancelLeaveRequestHandler);

export default router;
