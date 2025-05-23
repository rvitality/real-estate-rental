import createError from "http-errors";
import { PrismaClient, Manager } from "@prisma/client";

const prisma = new PrismaClient();

export const getManager = async (cognitoId: string): Promise<Manager> => {
    try {
        const manager = await prisma.manager.findUnique({
            where: { cognitoId },
        });

        if (!manager) {
            throw createError.NotFound("Manager not found");
        }

        return manager;
    } catch (err) {
        throw err;
    }
};

export const updateManager = async (cognitoId: string, details: Manager): Promise<Tenant> => {
    try {
        const { name, email, phoneNumber } = details;

        const updateManager = await prisma.manager.update({
            where: { cognitoId },
            data: {
                name,
                email,
                phoneNumber,
            },
        });

        return updateManager;
    } catch (err) {
        throw err;
    }
};

export const createManager = async (details: Manager): Promise<Manager> => {
    try {
        const { cognitoId, name, email, phoneNumber } = details;

        const manager = await prisma.manager.create({
            data: {
                cognitoId,
                name,
                email,
                phoneNumber,
            },
        });

        return manager;
    } catch (err) {
        throw err;
    }
};
