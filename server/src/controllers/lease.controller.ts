import { Request, Response } from "express";

// Service
import * as service from "../services/lease.service";

// Lib
import { handleErrorResponse } from "../lib/handleErrorResponse.lib";

export const getLeases = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await service.getLeases();
        res.json(result);
    } catch (err: any) {
        handleErrorResponse(err, req, res);
    }
};

export const getLeasePayments = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: leaseId } = req.params;
        const result = await service.getLeasePayments(leaseId);
        res.json(result);
    } catch (err: any) {
        handleErrorResponse(err, req, res);
    }
};
