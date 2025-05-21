import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// types
import { Application, Lease, Manager, Payment, Property, Tenant } from "@/types/prismaTypes";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
        prepareHeaders: async (headers) => {
            const session = await fetchAuthSession();
            const { idToken } = session.tokens ?? {};
            if (idToken) {
                headers.set("Authorization", `Bearer ${idToken}`);
            }
            return headers;
        },
    }),
    reducerPath: "api",
    tagTypes: [],
    endpoints: (build) => ({
        getAuthUser: build.query<User, void>({
            queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
                try {
                    const session = await fetchAuthSession();
                    const { idToken } = session.tokens ?? {};
                    const user = await getCurrentUser();
                    const userRole = idToken?.payload["custom:role"] as string;

                    const endpoint = userRole === "manager" ? `/managers/${user.userId}` : `/tenants/${user.userId}`;

                    const userDetailsResponse = await fetchWithBQ(endpoint);

                    return {
                        data: {
                            cognitoInfo: { ...user },
                            userInfo: userDetailsResponse.data as Tenant | Manager,
                            userRole,
                        },
                    };
                } catch (err: any) {
                    return { error: err.message || "Could not fetch user data" };
                }
            },
        }),
    }),
});

export const {} = api;
