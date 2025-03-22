import { Response } from "express";

export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  error: any,
  statusCode: number = 500
) => {
  console.error("Error:", error);
  return res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong",
  });
};
