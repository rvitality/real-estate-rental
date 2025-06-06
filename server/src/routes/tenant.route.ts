import express from "express";

// Controllers
import {
    getTenant,
    createTenant,
    updateTenant,
    getCurrentResidences,
    addFavoriteProperty,
    removeFavoriteProperty,
} from "../controllers/tenant.controller";

const router = express.Router();

router.get("/:cognitoId", getTenant);
router.put("/:cognitoId", updateTenant);
router.put("/:cognitoId/current-residences", getCurrentResidences);
router.post("/", createTenant);
router.post("/:cognitoId/favorites/:propertyId", addFavoriteProperty);
router.delete("/:cognitoId/favorites/:propertyId", removeFavoriteProperty);

export default router;
