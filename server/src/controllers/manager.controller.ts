import createError from "http-errors";
import { Request, Response } from "express";

// Service
import * as service from "../services/manager.service";

// Lib
import { handleErrorResponse } from "../lib/handleErrorResponse.lib";

export const getManager = async (req: Request, res: Response): Promise<void> => {
    try {
        // const { payload } = req;
        const { cognitoId } = req.params;

        const result = await service.getManager(cognitoId);
        res.json(result);
    } catch (err: any) {
        handleErrorResponse(err, req, res);
    }
};

export const updateManager = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cognitoId } = req.params;
        const { body: details } = req;

        const result = await service.updateManager(cognitoId, details);
        res.status(200).json(result);
    } catch (err: any) {
        handleErrorResponse(err, req, res);
    }
};

export const createManager = async (req: Request, res: Response): Promise<void> => {
    try {
        const { body: details } = req;

        const result = await service.createManager(details);
        res.status(201).json(result);
    } catch (err: any) {
        handleErrorResponse(err, req, res);
    }
};
