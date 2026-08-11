import { Router } from "express";
import { listJobs, getJobById } from "../controllers/jobsController.js";

const router = Router();

router.get("/", listJobs);
router.get("/:id", getJobById);

export default router;
