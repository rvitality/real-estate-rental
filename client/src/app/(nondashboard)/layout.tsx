"use client";

import React from "react";
import { NAVBAR_HEIGHT } from "@/lib/constants";

// Querys
import { useGetAuthUserQuery } from "@/state/api";

// Components
import Navbar from "@/components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
    return (
        <div className='h-full w-full'>
            <Navbar />
            <main className={`h-full flex w-full flex-col`} style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
