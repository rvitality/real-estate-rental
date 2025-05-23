// middlewares/errorHandler.ts
import { isHttpError } from "http-errors";
import { Request, Response } from "express";

export const handleErrorResponse = (err: any, req: Request, res: Response) => {
    if (isHttpError(err)) {
        res.status(err.statusCode).json({ message: err.message });
    } else {
        res.status(500).json({ message: "Something went wrong. Please contact your administrator." });
    }
};
