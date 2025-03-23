// @ts-nocheck (Disable TypeScript checking for this file)

import express from "express";
import {
  getTasksByBoardHandler,
  getTasksByUserHandler,
  getTaskByIdHandler,
  updateTaskHandler,
} from "../controller/taskController";

const router = express.Router();

router.get("/team/:teamId", getTasksByBoardHandler);

router.get("/user/:userId", getTasksByUserHandler);

router.get("/:taskId", getTaskByIdHandler);

router.put("/:taskId/update", updateTaskHandler);

export default router;
