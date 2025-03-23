// @ts-nocheck (Disable TypeScript checking for this file)

import express from "express";
import {
  createPriorityBoardHandler,
  getPriorityBoardHandler,
  addTaskHandler,
  getTasksByBoardHandler,
  getTaskByIdHandler,
  updateTaskHandler,
} from "../controller/priorityBoardController";

const router = express.Router();

router.post("/", createPriorityBoardHandler);
router.get("/:teamId", getPriorityBoardHandler);

router.post("/:teamId/tasks", addTaskHandler);
router.get("/:teamId/tasks", getTasksByBoardHandler);
router.get("/tasks/:taskId", getTaskByIdHandler);
router.put("/tasks/:taskId/update", updateTaskHandler);

export default router;
