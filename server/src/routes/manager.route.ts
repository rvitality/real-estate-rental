import express from "express";

// Controllers
import { getManager, createManager, updateManager, getManagerProperties } from "../controllers/manager.controller";

const router = express.Router();

router.get("/:cognitoId", getManager);
router.put("/:cognitoId", updateManager);
router.put("/:cognitoId/properties", getManagerProperties);
router.post("/", createManager);

export default router;
