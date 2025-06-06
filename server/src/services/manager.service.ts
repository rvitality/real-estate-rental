import createError from "http-errors";
import { PrismaClient, Manager, Property } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const getManager = async (cognitoId: string): Promise<Manager> => {
    try {
        const manager = await prisma.manager.findUnique({
            where: { cognitoId },
        });

        if (!manager) {
            throw createError.NotFound("Manager not found.");
        }

        return manager;
    } catch (err) {
        throw err;
    }
};

export const updateManager = async (cognitoId: string, details: Manager): Promise<Manager> => {
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

export const getManagerProperties = async (cognitoId: string): Promise<Property[]> => {
    try {
        const manager = await prisma.manager.findUnique({
            where: { cognitoId },
        });

        if (!manager) {
            throw createError.NotFound("Manager not found.");
        }

        const properties = await prisma.property.findMany({
            where: { managerCognitoId: cognitoId },
            include: {
                location: true,
            },
        });

        const propertiesWithFormattedLocation = await Promise.all(
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

        return propertiesWithFormattedLocation;
    } catch (err) {
        throw err;
    }
};
