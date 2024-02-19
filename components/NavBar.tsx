"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import defaultLogo from '@/img/logo.png';
import darkLogo from '@/img/logo-white.png';

export default function NavBar({children} : {children: React.ReactNode}) {

  



  return (
    <nav
      className="sticky top-0 z-10 block w-full max-w-full px-4 py-2 text-white bg-background border rounded-none shadow-md h-max border-background/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between text-foreground">
      <Link href="/">
          {/*eslint-disable-next-line*/}
          <img src={defaultLogo.src} alt="Company Logo" width={200} height={150} className="lightLogo"/>
          <img src={darkLogo.src} alt="Company Logo" width={200} height={150} className="darkLogo"/>
      </Link>
        <div className="flex items-center gap-4">
          <div className="hidden mr-4 lg:block">
            <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal text-inherit">
                <a href="/notes" className="flex items-center">
                  Notes
                </a>
              </li>
              <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal text-inherit">
                <a href="/admin/dashboard" className="flex items-center">
                  Dashboard
                </a>
              </li>
              <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal">
                <a href="#" className="flex items-center">
                  Blocks
                </a>
              </li>
              <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal">
                <a href="#" className="flex items-center">
                  Docs
                </a>
              </li>
              <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal">
              
              {children}
              </li>
            </ul>
            
          </div>
        </div>
      </div>
    </nav>
  )
}
