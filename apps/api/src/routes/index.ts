import { Router } from "express";
import jobsRouter from "./jobs.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/jobs", jobsRouter);

export default router;
