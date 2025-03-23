// @ts-nocheck (Disable TypeScript checking for this file)

import express from "express";
import {
  createTeamHandler,
  getAllTeamsHandler,
  getTeamByIdHandler,
  updateTeamHandler,
  deleteTeamHandler,
} from "../controller/teamController";

const router = express.Router();

router.post("/", createTeamHandler);
router.get("/", getAllTeamsHandler);
router.get("/:id", getTeamByIdHandler);
router.put("/:id", updateTeamHandler);
router.delete("/:id", deleteTeamHandler);

export default router;
