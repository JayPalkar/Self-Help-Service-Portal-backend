
import { Request, Response } from "express";
import {
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getAllProjects,
} from "../services/projectService";
import { getCognitoUserId } from "../services/userService";

export const createProjectHandler = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;
    const { name, description, assignedTeams } = req.body; 
    const createdBy = await getCognitoUserId(accessToken); 
    const projectColor = `#${Math.floor(Math.random() * 16777215).toString(
      16
    )}`;
    const project = await createProject(
      name,
      description,
      createdBy,
      assignedTeams,
      projectColor
    );

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectByIdHandler = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({ success: true, project });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProjectsHandler = async (req: Request, res: Response) => {
  try {
    const projects = await getAllProjects();
    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      projects,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProjectHandler = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const { name, description, assignedTeams, projectColor } = req.body;

    await updateProject(
      projectId,
      name,
      description,
      assignedTeams,
      projectColor
    );
    return res
      .status(200)
      .json({ success: true, message: "Project updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProjectHandler = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    await deleteProject(projectId);
    return res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
