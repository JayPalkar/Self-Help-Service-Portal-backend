import { Request, Response } from "express";
import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} from "../services/teamService";
import { successResponse, errorResponse } from "../utils/responseHelper";
import { getCognitoUserId, getUserRole } from "../services/userService";

export const createTeamHandler = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;
    const createdBy = await getCognitoUserId(accessToken);

    if (!createdBy) {
      return errorResponse(res, "Unauthorized. Invalid access token.", 401);
    }

    const role = await getUserRole(createdBy);

    if (role !== "Admin") {
      return errorResponse(res, "Only Admins can create teams.", 403);
    }

    const { name, headId } = req.body;
    const team = await createTeam(name, headId, createdBy);
    return successResponse(res, 201, "Team created successfully", team);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getAllTeamsHandler = async (req: Request, res: Response) => {
  try {
    const teams = await getAllTeams();
    return successResponse(res, 200, "Teams fetched successfully", teams);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getTeamByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const team = await getTeamById(id);
    if (!team) return errorResponse(res, "Team not found", 404);

    return successResponse(res, 200, "Team fetched successfully", team);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const updateTeamHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, headId } = req.body;
    const updatedTeam = await updateTeam(id, name, headId);
    return successResponse(res, 200, "Team updated successfully", updatedTeam);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const deleteTeamHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteTeam(id);
    return successResponse(res, 200, "Team deleted successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};
