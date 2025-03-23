// @ts-nocheck (Disable TypeScript checking for this file)

import { Router } from "express";
import {
  createProjectHandler,
  getAllProjectsHandler,
  getProjectByIdHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from "../controller/projectController";

const router = Router();

router.post("/", createProjectHandler);
router.get("/", getAllProjectsHandler);
router.get("/:id", getProjectByIdHandler);
router.put("/:id", updateProjectHandler);
router.delete("/:id", deleteProjectHandler);

export default router;
