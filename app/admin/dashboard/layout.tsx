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
            <div className="flex">
                <MenuBarMobile setter={setShowSidebar} />
                <Sidebar show={showSidebar} setter={setShowSidebar} />
                <div className="flex flex-col flex-grow w-screen md:w-full min-h-screen">
                    {children}
                </div>
            </div>
        </div>
                
    )
}