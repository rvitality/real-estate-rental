import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cleanParams, createNewUserInDatabase, withToast } from "@/lib/utils";

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
    tagTypes: ["Managers", "Tenants", "Properties", "PropertyDetails", "Leases", "Payments", "Applications"],
    endpoints: (build) => ({
        getAuthUser: build.query<User, void>({
            queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
                try {
                    const session = await fetchAuthSession();
                    const { idToken } = session.tokens ?? {};
                    const user = await getCurrentUser();
                    const userRole = idToken?.payload["custom:role"] as string;

                    const endpoint = userRole === "manager" ? `/managers/${user.userId}` : `/tenants/${user.userId}`;
                    let userDetailsResponse = await fetchWithBQ(endpoint);

                    if (userDetailsResponse.error && userDetailsResponse.error.status === 404) {
                        userDetailsResponse = await createNewUserInDatabase(user, idToken, userRole, fetchWithBQ);
                    }

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
        updateTenantSettings: build.mutation<Tenant, { cognitoId: string & Partial<Tenant> }>({
            query: ({ cognitoId, ...updatedTenant }) => ({
                url: `tenants/${cognitoId}`,
                method: "PUT",
                body: updatedTenant,
            }),
            invalidatesTags: (result) => [{ type: "Tenants", id: result?.id }],
        }),
        updateManagerSettings: build.mutation<Manager, { cognitoId: string & Partial<Manager> }>({
            query: ({ cognitoId, ...updatedManager }) => ({
                url: `managers/${cognitoId}`,
                method: "PUT",
                body: updatedManager,
            }),
            invalidatesTags: (result) => [{ type: "Managers", id: result?.id }],
        }),
    }),
});

export const { useGetAuthUserQuery, useUpdateTenantSettingsMutation,
     useUpdateManagerSettingsMutation } = api;
