import express from "express";

// Controllers
import { getTenant, createTenant } from "../controllers/tenant.controller";

const router = express.Router();

router.get("/:cognitoId", getTenant);
router.post("/", createTenant);

export default router;
