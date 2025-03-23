import { Request, Response } from "express";
import {
  createPriorityBoard,
  getPriorityBoardByTeam,
} from "../services/priorityBoardService";
import {
  createTask,
  getTasksByBoard,
  getTaskById,
  updateTask,
} from "../services/taskService";
import { successResponse, errorResponse } from "../utils/responseHelper";

export const createPriorityBoardHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { teamId, projectId } = req.body;

    const board = await createPriorityBoard(teamId, projectId);
    return successResponse(
      res,
      201,
      "Priority board created successfully",
      board
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getPriorityBoardHandler = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;

    const board = await getPriorityBoardByTeam(teamId);
    if (!board) return errorResponse(res, "Priority board not found", 404);

    return successResponse(
      res,
      200,
      "Priority board fetched successfully",
      board
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const addTaskHandler = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const { projectId, title, description, assignedTo, priority, deadline } =
      req.body;

    const task = await createTask(
      teamId,
      projectId,
      title,
      description,
      assignedTo,
      priority,
      deadline
    );
    return successResponse(res, 201, "Task added successfully", task);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getTasksByBoardHandler = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const boardId = `${teamId}-board`;

    const tasks = await getTasksByBoard(boardId);
    return successResponse(res, 200, "Tasks fetched successfully", tasks);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getTaskByIdHandler = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await getTaskById(taskId);

    if (!task) return errorResponse(res, "Task not found", 404);
    return successResponse(res, 200, "Task fetched successfully", task);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const updateTaskHandler = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    const updatedTask = await updateTask(taskId, updates);
    return successResponse(res, 200, "Task updated successfully", updatedTask);
  } catch (error) {
    return errorResponse(res, error);
  }
};
