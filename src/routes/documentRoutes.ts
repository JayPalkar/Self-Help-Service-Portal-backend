// @ts-nocheck (Disable TypeScript checking for this file)

import express from "express";
import {
  requestDocumentHandler,
  uploadDocumentHandler,
  rejectDocumentHandler,
  getPendingRequestsHandler,
  getDocumentHandler,
} from "../controller/documentController";

const router = express.Router();

router.post("/request", requestDocumentHandler);
router.get("/requests", getPendingRequestsHandler);
router.put("/:id/upload", uploadDocumentHandler);
router.put("/:id/reject", rejectDocumentHandler);
router.get("/:id", getDocumentHandler);

export default router;
