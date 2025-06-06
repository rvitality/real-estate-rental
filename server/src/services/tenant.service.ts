import createError from "http-errors";
import { PrismaClient, Property, Tenant } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

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

export const updateTenant = async (cognitoId: string, details: Tenant): Promise<Tenant> => {
    try {
        const { name, email, phoneNumber } = details;

        const updateTenant = await prisma.tenant.update({
            where: { cognitoId },
            data: {
                name,
                email,
                phoneNumber,
            },
        });

        return updateTenant;
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

export const getCurrentResidences = async (cognitoId: string): Promise<Property[]> => {
    try {
        const properties = await prisma.property.findMany({
            where: { tenants: { some: { cognitoId } } },
            include: {
                location: true,
            },
        });

        const residencesWithFormattedLocation = await Promise.all(
            properties.map(async (property) => {
                const coordinates: { coordinates: string }[] =
                    await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" WHERE id = ${property.location.id}`;

                const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
                const longitude = geoJSON.coordinates[0];
                const latitude = geoJSON.coordinates[1];

                const propertyWithCoordinates = {
                    ...property,
                    location: {
                        ...property.location,
                        coordinates: {
                            longitude,
                            latitude,
                        },
                    },
                };

                return propertyWithCoordinates;
            })
        );

        return residencesWithFormattedLocation;
    } catch (err) {
        throw err;
    }
};
