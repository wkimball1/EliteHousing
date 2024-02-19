'use client';
import React, { useState } from 'react'
import Head from 'next/head'
import Sidebar from '../../../components/Sidebar';
import MenuBarMobile from '../../../components/MenuBarMobile';

export default function DashboardLayout({ pageTitle, children } : {pageTitle:string, children:React.ReactNode}) {
    // Concatenate page title (if exists) to site title
    let titleConcat = "Responsive Sidebar Example";
    if (pageTitle) titleConcat = pageTitle + " | " + titleConcat;

    // Mobile sidebar visibility state
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div className="min-h-screen">
            <div className="flex">
                <MenuBarMobile setter={setShowSidebar} />
                <Sidebar show={showSidebar} setter={setShowSidebar} />
                <div className="flex flex-col flex-grow w-screen md:w-full min-h-screen items-center">
                    {children}
                </div>
            </div>
        </div>
                
    )
}