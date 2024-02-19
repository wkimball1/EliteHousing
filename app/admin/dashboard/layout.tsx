'use client';
import React, { useState } from 'react'
import Head from 'next/head'
import Sidebar from '../../../components/Sidebar';
import MenuBarMobile from '../../../components/MenuBarMobile';

export default function DashboardLayout({ children } : {children: React.ReactNode}) {


    // Mobile sidebar visibility state
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div className="min-h-screen">
            <div className="flex min-h-screen">
                <MenuBarMobile setter={setShowSidebar} />
                <Sidebar show={showSidebar} setter={setShowSidebar} />
                <div className="flex flex-col w-full max-w-full min-h-screen justify-start items-center py-20 px-2">
                    {children}
                </div>
            </div>
        </div>
                
    )
}