import createError from "http-errors";
import { Request, Response } from "express";

// Service
import * as service from "../services/tenant.service";

export const getManager = async (req: Request, res: Response): Promise<void> => {
    try {
        // const { payload } = req;
        const { cognitoId } = req.params;

        const result = await service.getManager(cognitoId);
        res.json(result);
    } catch (err: any) {
        throw createError.InternalServerError(`Error retrieving tenant: ${err.message}`);
        // res.status(500).json({ message: `Error retrieving tenant: ${err.message}` });
    }
};

export const createManager = async (req: Request, res: Response): Promise<void> => {
    try {
        const { body: details } = req;

        const result = await service.createManager(details);
        res.status(201).json(result);
    } catch (err: any) {
        throw createError.InternalServerError(`Error creating tenant: ${err.message}`);
    }
};
