import { Request, Response } from "express";
import {
  createTask,
  getTasksByBoard,
  getTasksByUser,
  updateTask,
  getTaskById,
} from "../services/taskService";
import { successResponse, errorResponse } from "../utils/responseHelper";

export const createTaskHandler = async (req: Request, res: Response) => {
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
    return successResponse(res, 201, "Task created successfully", task);
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

export const getTasksByUserHandler = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const tasks = await getTasksByUser(userId);
    return successResponse(res, 200, "Tasks fetched successfully", tasks);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getTaskByIdHandler = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const task = await getTaskById(taskId);
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
