import { Request, Response } from "express";
import {
  createUserInCognito,
  authenticateUser,
  globalSignOut,
} from "../services/cognitoService";
import { saveUserDetails } from "../services/userService";
import { successResponse, errorResponse } from "../utils/responseHelper";

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const cognitoUser = await createUserInCognito(email, password, "Admin");
    return successResponse(res, 201, "Admin registered successfully", {
      cognitoUser,
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const authResult = await authenticateUser(email, password);

    res.cookie("idToken", authResult?.IdToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("accessToken", authResult?.AccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });
    return successResponse(res, 200, "Admin logged in successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const logoutAdmin = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) throw new Error("No access token provided");

    await globalSignOut(accessToken);
    res.clearCookie("idToken");
    res.clearCookie("accessToken");
    return successResponse(res, 200, "Admin logged out successfully");
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const loginEmployee = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const authResult = await authenticateUser(email, password);

    res.cookie("idToken", authResult?.IdToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("accessToken", authResult?.AccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });
    return successResponse(res, 200, "Employee logged in successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const logoutEmployee = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) throw new Error("No access token provided");

    await globalSignOut(accessToken);
    res.clearCookie("idToken");
    res.clearCookie("accessToken");
    return successResponse(res, 200, "Employee logged out successfully");
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { email, password, role, dob, joiningDate, upiId } = req.body;
    const cognitoUser = await createUserInCognito(email, password, "Employee");
    await saveUserDetails(
      cognitoUser.CognitoUserId,
      role,
      dob,
      joiningDate,
      upiId
    );
    return successResponse(res, 201, "Employee created successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};
