"use client";

import React from "react";
import { useGetAuthUserQuery, useUpdateManagerSettingsMutation } from "@/state/api";

import SettingsForm from "@/components/SettingsForm";

const ManagerSettings = () => {
    const { data: authUser, isLoading } = useGetAuthUserQuery();
    const [updateManager] = useUpdateManagerSettingsMutation();

    const initialData = {
        name: authUser?.userInfo.name,
        email: authUser?.userInfo.email,
        phoneNumber: authUser?.userInfo.phoneNumber,
    };
    const handleSubmit = async (data: typeof initialData) => {
        await updateManager({
            cognitoId: authUser?.cognitoInfo?.userId,
            ...data,
        });
    };

    if (isLoading) return <>Loading...</>;

    return <SettingsForm initialData={initialData} onSubmit={handleSubmit} userType='manager' />;
};

export default ManagerSettings;
