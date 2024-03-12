import React from "react";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import AuthButton from "@/components/AuthButton";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-screen bg-background">
      <div className="w-full fixed z-50 top-0 left-0">
        <NavBar />
      </div>

      <div className="flex w-full max-w-full flex-1 pt-16 pb-4 md:py-4 px-2">
        {children}
      </div>
    </div>
  );
}
