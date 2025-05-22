import express from "express";

// Controllers
import { getManager, createManager } from "../controllers/manager.controller";

const router = express.Router();

router.get("/:cognitoId", getManager);
router.post("/", createManager);

export default router;
