import createError from "http-errors";
import { Lease, PrismaClient, Payment } from "@prisma/client";

const prisma = new PrismaClient();

export const getLeases = async (): Promise<Lease[]> => {
    try {
        const leases = await prisma.lease.findMany({
            include: {
                tenant: true,
                property: true,
            },
        });

        return leases;
    } catch (err) {
        throw err;
    }
};

export const getLeasePayments = async (leaseId: number): Promise<Payment[]> => {
    try {
        const payments = await prisma.payment.findMany({
            where: {
                leaseId: Number(leaseId),
            },
        });

        return payments;
    } catch (err) {
        throw err;
    }
};
