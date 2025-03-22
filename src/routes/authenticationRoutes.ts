// @ts-nocheck (Disable TypeScript checking for this file)

import { Router } from "express";
import {
  createEmployee,
  loginAdmin,
  loginEmployee,
  logoutAdmin,
  logoutEmployee,
  registerAdmin,
} from "../controller/authenticationController";

const router = Router();

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);
router.post("/admin/logout", logoutAdmin);
router.post("/admin/create-employee", createEmployee);
router.post("/employee/login", loginEmployee);
router.post("/employee/logout", logoutEmployee);

export default router;
