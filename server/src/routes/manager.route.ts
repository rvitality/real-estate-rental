import express from "express";

// Controllers
import { getManager, createManager, updateManager } from "../controllers/manager.controller";

const router = express.Router();

router.get("/:cognitoId", getManager);
router.put("/:cognitoId", updateManager);
router.post("/", createManager);

export default router;
