import express from "express";

// Controllers
import { getTenant, createTenant, updateTenant } from "../controllers/tenant.controller";

const router = express.Router();

router.get("/:cognitoId", getTenant);
router.put("/:cognitoId", updateTenant);
router.post("/", createTenant);

export default router;
