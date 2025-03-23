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

router.post("/request", requestDocumentHandler); // Employee requests a document
router.get("/requests", getPendingRequestsHandler); // Admin views all requests
router.put("/:id/upload", uploadDocumentHandler); // Admin uploads a document
router.put("/:id/reject", rejectDocumentHandler); // Admin rejects a request
router.get("/:id", getDocumentHandler); // Employee views document

export default router;
