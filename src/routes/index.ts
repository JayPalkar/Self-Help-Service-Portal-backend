import { Router } from "express";

import test from "./testRoute";

const router = Router();

router.use("/test", test);

export default router;
