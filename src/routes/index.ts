import { Router } from "express";

import authentication from "./authenticationRoutes";
import teamRoutes from "./teamRoutes";
import projectRoutes from "./projectRoutes";
import attendanceRoutes from "./attendanceRoutes";
import leaveRoutes from "./leaveRoutes";

const router = Router();

router.use("/auth", authentication);
router.use("/teams", teamRoutes);
router.use("/projects", projectRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/leaves", leaveRoutes);
export default router;
