import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("testing servereless");
});

export default router;
