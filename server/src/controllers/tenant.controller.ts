import createError from "http-errors";
import { Request, Response } from "express";

// Service
import * as service from "../services/tenant.service";

// Lib
import { handleErrorResponse } from "../lib/handleErrorResponse.lib";

export const getTenant = async (req: Request, res: Response): Promise<void> => {
    try {
        // const { payload } = req;
        const { cognitoId } = req.params;

        const result = await service.getTenant(cognitoId);
        res.json(result);
    } catch (err: any) {
        handleErrorResponse(err, req, res);
    }
};

export const updateTenant = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cognitoId } = req.params;
        const { body: details } = req;

        const result = await service.updateTenant(cognitoId, details);
        res.status(200).json(result);
    } catch (err: any) {
        handleErrorResponse(err, req, res);
    }
};

export const createTenant = async (req: Request, res: Response): Promise<void> => {
    try {
        const { body: details } = req;

        const result = await service.createTenant(details);
        res.status(201).json(result);
    } catch (err: any) {
        handleErrorResponse(err, req, res);
    }
};

export const getCurrentResidences = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cognitoId } = req.params;

        const result = await service.getCurrentResidences(cognitoId);
        res.json(result);
    } catch (err: any) {
        handleErrorResponse(err, req, res);
    }
};