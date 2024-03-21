"use client";
import React, { Suspense, useState } from "react";
import Head from "next/head";
import SidebarNav from "@/components/SidebarNav";
import Loading from "./loading";
import AuthButton from "@/components/AuthButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mobile sidebar visibility state

  return (
    <div className="flex w-full max-w-full min-h-screen bg-background">
      <SidebarNav />

      <div className="flex flex-col w-full max-w-full justify-start items-center py-16 md:py-4 px-2 bg-background">
        {children}
      </div>
    </div>
  );
}
