import Link from "next/link";
import React, { useEffect, useState } from "react";
import defaultLogo from "@/img/logo.png";
import darkLogo from "@/img/logo-white.png";
import { FiMenu as Icon } from "react-icons/fi";
import Image from "next/image";

export default function NavBar() {
  return (
    <div className="w-full max-w-full py-0">
      {/* desktop */}
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-60"
            >
              <li>
                <a href="/" className="flex items-center">
                  Home
                </a>
              </li>
              <li>
                <a>Our Services</a>
                <ul className="p-2">
                  <li className="block px-4 py-2 text-sm text-gray-700">
                    Cabinets
                  </li>
                  <li className="block px-4 py-2 text-sm text-gray-700">
                    Appliances
                  </li>
                  <li className="block px-4 py-2 text-sm text-gray-700">
                    Lighting and Fans
                  </li>
                  <li className="block px-4 py-2 text-sm text-gray-700">
                    Kitchen and Bath Plumbing
                  </li>
                  <li className="block px-4 py-2 text-sm text-gray-700">
                    Countertops and Tile
                  </li>
                </ul>
              </li>
              <li>
                <a href="/client/faq" className="flex items-center">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/client/contact" className="flex items-center">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
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
        </div>
        <div className="navbar-end hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a href="/" className="flex items-center">
                Home
              </a>
            </li>
            <li>
              <details>
                <summary>Our Services</summary>
                <ul className="p-2">
                  <li className="block px-4 py-2 text-sm text-gray-700">
                    Cabinets
                  </li>
                  <li className="block px-4 py-2 text-sm text-gray-700">
                    Appliances
                  </li>
                  <li className="block px-4 py-2 text-sm text-gray-700">
                    Lighting and Fans
                  </li>
                  <li className="block px-4 py-2 text-sm text-gray-700">
                    Kitchen and Bath Plumbing
                  </li>
                  <li className="block px-4 py-2 text-sm text-gray-700">
                    Countertops and Tile
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a href="/client/faq" className="flex items-center">
                FAQ
              </a>
            </li>
            <li>
              <a href="/client/contact" className="flex items-center">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/admin/dashboard" className="flex items-center">
                Dashboard
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
