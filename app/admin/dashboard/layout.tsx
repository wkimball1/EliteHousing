"use client";
import React, { useState } from "react";
import Head from "next/head";
import Sidebar from "../../../components/Sidebar";
import MenuBarMobile from "../../../components/MenuBarMobile";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mobile sidebar visibility state
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex w-full max-w-full min-h-screen">
      <MenuBarMobile setter={setShowSidebar} />
      <Sidebar show={showSidebar} setter={setShowSidebar} />
      <div className="flex flex-col w-full max-w-full justify-start items-center py-16 md:py-4 px-2">
        {children}
      </div>
    </div>
  );
}
