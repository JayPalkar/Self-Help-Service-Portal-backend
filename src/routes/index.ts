import { Router } from "express";

import authentication from "./authenticationRoutes";
import employeeRoute from "./employeeRoute";
import teamRoutes from "./teamRoutes";
import projectRoutes from "./projectRoutes";
import attendanceRoutes from "./attendanceRoutes";
import leaveRoutes from "./leaveRoutes";
import financeRoutes from "./financeRoutes";
import documentRoutes from "./documentRoutes";
import taskRoutes from "./taskRoutes";
import priorityBoardRoutes from "./priorityBoardRoutes";

const router = Router();

router.use("/auth", authentication);
router.use("/employee", employeeRoute);
router.use("/teams", teamRoutes);
router.use("/projects", projectRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/leaves", leaveRoutes);
router.use("/finance", financeRoutes);
router.use("/documents", documentRoutes);
router.use("/tasks", taskRoutes);
router.use("/priority-board", priorityBoardRoutes);
export default router;
