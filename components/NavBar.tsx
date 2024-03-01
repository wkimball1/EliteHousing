"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import defaultLogo from "@/img/logo.png";
import darkLogo from "@/img/logo-white.png";
import { FiMenu as Icon } from "react-icons/fi";
import Image from "next/image";

export default function NavBar() {
  const [navBar, setNavBar] = useState(false);

  return (
    <div className="w-full max-w-full px-4 py-2">
      {/* desktop */}
      <nav className="hidden sticky top-0 z-10 lg:block w-full max-w-full px-4 py-2 text-foreground bg-background border rounded-none shadow-md h-max border-background/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-foreground">
          <Link href="/">
            <img
              src={defaultLogo.src}
              alt="Company Logo"
              width={250}
              height={150}
              className="lightLogo"
            />
            <img
              src={darkLogo.src}
              alt="Company Logo"
              width={250}
              height={150}
              className="darkLogo"
            />
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden mr-4 lg:block">
              <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal text-inherit">
                  <a href="/client/notes" className="flex items-center">
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
                    Our Services
                  </a>
                </li>
                <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal">
                  <a href="#" className="flex items-center">
                    FAQ
                  </a>
                </li>
                <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal">
                  <a href="/client/contact" className="flex items-center">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {/* mobile */}
      <nav className="lg:hidden z-10 bg-background px-2 w-full max-w-full ">
        <div className="flex justify-center justify-between w-full max-w-full">
          <Link className="flex justify-start" href="/">
            <img
              src={defaultLogo.src}
              alt="Company Logo"
              width={200}
              height={150}
              className="lightLogo"
            />
            <img
              src={darkLogo.src}
              alt="Company Logo"
              width={200}
              height={150}
              className="darkLogo"
            />
          </Link>
          <button
            className="text-4xl text-foreground flex justify-end"
            onClick={() => {
              setNavBar(!navBar);
            }}
          >
            <Icon />
          </button>
        </div>
        <div className={`lg:block ${navBar ? "block" : "hidden"}`}>
          <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal text-inherit">
              <a href="/client/notes" className="flex items-center">
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
                Our Services
              </a>
            </li>
            <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal">
              <a href="#" className="flex items-center">
                FAQ
              </a>
            </li>
            <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal">
              <a href="/client/contact" className="flex items-center">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
