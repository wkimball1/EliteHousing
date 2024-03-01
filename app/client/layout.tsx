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
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex w-full max-w-full flex-1 py-16 md:py-4 px-2">
        {children}
      </div>
    </div>
  );
}
