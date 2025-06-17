import express from "express";

// Controllers
import { getLeases, getLeasePayments } from "../controllers/lease.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware(["manager", "tenant"]), getLeases);
router.post("/:id/payments", authMiddleware(["manager", "tenant"]), getLeasePayments);

export default router;
