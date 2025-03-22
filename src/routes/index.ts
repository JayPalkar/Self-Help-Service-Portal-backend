import { Router } from "express";

import authentication from "./authenticationRoutes";

const router = Router();

router.use("/auth", authentication);

export default router;
