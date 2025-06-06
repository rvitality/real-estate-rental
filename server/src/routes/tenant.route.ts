import express from "express";

// Controllers
import { getTenant, createTenant, updateTenant, getCurrentResidences } from "../controllers/tenant.controller";

const router = express.Router();

router.get("/:cognitoId", getTenant);
router.put("/:cognitoId", updateTenant);
router.put("/:cognitoId/current-residences", getCurrentResidences);
router.post("/", createTenant);

export default router;
