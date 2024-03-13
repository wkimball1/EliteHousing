import React from "react";
import Link from "next/link";
import { FiMenu as Icon } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import defaultLogo from "@/img/logo.png";
import darkLogo from "@/img/logo-white.png";
import AuthButton from "./AuthButton";
import { useState } from "react";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`w-fit drawer z-20 ${isSidebarOpen ? "lg:drawer-open" : ""}`}
    >
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="flex flex-col items-start justify-start lg:hidden">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-lg btn-ghost drawer-button lg:hidden"
        >
          {<Icon size={30} />}
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        {isSidebarOpen && (
          <ul className="menu p-2 w-72 min-h-full bg-background text-base-content">
            <li className="user-select-none hover:bg-background focus:bg-background">
              <Link
                href="/admin/dashboard"
                className="user-select-none hover:bg-background focus:bg-background"
              >
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
            </li>

            <li>
              <Link href="/admin/dashboard">Home</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/employees">Employees</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/customers">Customers</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/inventory">Inventory</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/sales">Sales</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/jobs">Jobs</Link>
            </li>
            <li>
              <Link href="/">Client Website</Link>
            </li>
            <li className="user-select-none hover:bg-background focus:bg-background">
              <AuthButton />
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
