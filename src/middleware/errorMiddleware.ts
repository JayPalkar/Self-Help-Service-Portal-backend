import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Unhandled Error:", err);

  return res.status(500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
};
