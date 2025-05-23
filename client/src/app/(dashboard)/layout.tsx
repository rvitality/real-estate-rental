"use client";

import React, { useEffect, useState } from "react";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";

// Constants
import { NAVBAR_HEIGHT } from "@/lib/constants";

// Components
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { data: authUser, isLoading: isAuthLoading } = useGetAuthUserQuery();

    const isManager = authUser?.userRole?.toLowerCase() === "manager";
    const isTenant = authUser?.userRole?.toLowerCase() === "tenant";

    useEffect(() => {
        if (authUser && authUser.userRole) {
            if (isManager && !pathname.includes("/managers")) {
                router.push("/managers/properties", { scroll: false });
            } else if (isTenant && !pathname.includes("/tenants")) {
                router.push("/tenants/favorites", { scroll: false });
            }
        }
    }, [authUser, isManager, isTenant, router, pathname]);

    if (!authUser?.userRole) return null;
    if (isAuthLoading) return <div>Loading...</div>;

    return (
        <SidebarProvider>
            <div className='min-h-screen w-full bg-primary-100'>
                <Navbar />
                <div style={{ marginTop: `${NAVBAR_HEIGHT}px` }}>
                    <main className='flex'>
                        <AppSidebar userType={authUser.userRole.toLowerCase()} />
                        <div className='flex-grow transition-all duration-300'>{children}</div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;
