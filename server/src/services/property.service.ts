import createError from "http-errors";
import { PrismaClient, Manager, Prisma, PropertyType, Property } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export interface QueryTypes {
    favoriteIds: string;
    priceMin: string;
    priceMax: string;
    beds: string;
    baths: string;
    propertyType: string;
    squareFeetMin: string;
    squareFeetMax: string;
    amenities: string;
    availableFrom: string;
    latitude: string;
    longitude: string;
}

export const getProperties = async (queries: Partial<QueryTypes>): Promise<Property> => {
    try {
        const {
            favoriteIds,
            priceMin,
            priceMax,
            beds,
            baths,
            propertyType,
            squareFeetMin,
            squareFeetMax,
            amenities,
            availableFrom,
            latitude,
            longitude,
        } = queries;

        let whereConditions: Prisma.Sql[] = [];

        if (favoriteIds && favoriteIds?.length) {
            const favoriteIdsArr = (favoriteIds as string).split(",").map(Number);
            whereConditions.push(Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArr)})`);
        }

        if (priceMin) {
            const whereQuery = Prisma.sql`p."priceMin" >= ${Number(priceMin)}`;
            whereConditions.push(whereQuery);
        }

        if (priceMax) {
            const whereQuery = Prisma.sql`p."priceMax" <= ${Number(priceMax)}`;
            whereConditions.push(whereQuery);
        }

        if (beds && beds !== "any") {
            const whereQuery = Prisma.sql`p.beds >= ${Number(beds)}`;
            whereConditions.push(whereQuery);
        }

        if (baths && baths !== "any") {
            const whereQuery = Prisma.sql`p.baths >= ${Number(baths)}`;
            whereConditions.push(whereQuery);
        }

        if (squareFeetMin) {
            const whereQuery = Prisma.sql`p."squareFeetMin" >= ${Number(squareFeetMin)}`;
            whereConditions.push(whereQuery);
        }

        if (squareFeetMax) {
            const whereQuery = Prisma.sql`p."squareFeetMax" <= ${Number(squareFeetMax)}`;
            whereConditions.push(whereQuery);
        }

        if (propertyType && propertyType !== "any") {
            const whereQuery = Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`;
            whereConditions.push(whereQuery);
        }

        if (amenities && amenities !== "any") {
            const amenitiesArr = (amenities as string).split(",");
            const whereQuery = Prisma.sql`p.amenities @> ${amenitiesArr}`;

            whereConditions.push(whereQuery);
        }

        if (availableFrom && availableFrom !== "any" && typeof availableFrom === "string") {
            const availableFromDate = new Date(availableFrom);

            if (!isNaN(availableFromDate.getTime())) {
                whereConditions.push(
                    Prisma.sql` EXISTS (
                        SELECT 1 FROM "Lease" l
                        WHERE l."propertyId" = p.id
                        AND l."startDate" <= ${availableFromDate.toISOString()}
                    )
                    `
                );
            }
        }

        if (latitude && longitude) {
            const lat = parseFloat(latitude as string);
            const lng = parseFloat(longitude as string);
            const radiusInKilometers = 1000;
            const degrees = radiusInKilometers / 111; // Converts kilometers to degrees

            whereConditions.push(
                Prisma.sql`ST_DWithin(
                    l.coordinates::geometry,
                    ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
                    ${degrees}
                )`
            );
        }

        const completeQuery = Prisma.sql`
            SELECT
             p.*, 
             json_build_object(
                'id', l.id,
                'address', l.address,
                'city', l.city,
                'state', l.state,
                'country', l.country,
                'postalCode', l."postalCode",
                'coordinates', json_build_object(
                    'longitude', ST_X(l."coordinates"::geometry),
                    'latitude', ST_Y(l."coordinates"::geometry)
                )
             ) as location
             FROM "Property" p
             JOIN "Location" l ON p."locationId" = l.id
             ${whereConditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}` : Prisma.empty}
        `;

        const properties = (await prisma.$queryRaw(completeQuery)) as Property;

        return properties;
    } catch (err) {
        throw err;
    }
};

export const getProperty = async (propertyId: string): Promise<Property> => {
    try {
        const property = await prisma.property.findUnique({
            where: { id: Number(propertyId) },
            include: {
                location: true,
            },
        });

        if (!property) {
            throw createError.NotFound("Property not found.");
        }

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
    } catch (err) {
        throw err;
    }
};

export const createProperty = async (cognitoId: string): Promise<void> => {
    try {
    } catch (err) {
        throw err;
    }
};
