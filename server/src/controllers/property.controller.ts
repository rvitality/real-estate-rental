import createError from "http-errors";
import { Request, Response } from "express";

// Service
import * as service from "../services/property.service";

// Lib
import { handleErrorResponse } from "../lib/handleErrorResponse.lib";

// Types
import { QueryTypes } from "../services/property.service";

export const getProperties = async (req: Request, res: Response): Promise<void> => {
    try {
        const queries: Partial<QueryTypes> = req.query;

        const result = await service.getProperties(queries);
        res.json(result);
    } catch (err: any) {
        handleErrorResponse(err, req, res);
    }
};

export const getProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: propertyId } = req.params;

        const result = await service.getProperty(propertyId);
        res.json(result);
    } catch (err: any) {
        handleErrorResponse(err, req, res);
    }
};

export const createProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[];
        const details = req.body;

        const result = await service.createProperty(details, files);
        res.status(201).json(result);
    } catch (err: any) {
        handleErrorResponse(err, req, res);
    }
};
