import createError from "http-errors";
import { PrismaClient, Tenant } from "@prisma/client";

const prisma = new PrismaClient();

export const getTenant = async (cognitoId: string): Promise<Tenant> => {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: { cognitoId },
            include: {
                favorites: true,
            },
        });

        if (!tenant) {
            throw createError.NotFound("Tenant not found");
        }

        return tenant;
    } catch (err) {
        throw err;
    }
};

export const createTenant = async (details: Tenant): Promise<Tenant> => {
    try {
        const { cognitoId, name, email, phoneNumber } = details;

        const tenant = await prisma.tenant.create({
            data: {
                cognitoId,
                name,
                email,
                phoneNumber,
            },
        });

        return tenant;
    } catch (err) {
        throw err;
    }
};
