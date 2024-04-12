import React from "react";
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
      className={`w-fit h-fit drawer ${isSidebarOpen ? "lg:drawer-open" : ""}`}
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
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        {isSidebarOpen && (
          <ul className="menu p-2 w-72 z-50 min-h-full bg-background text-base-content">
            <li className="user-select-none hover:bg-background focus:bg-background">
              <a
                href="/admin/dashboard/customers"
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
              </a>
            </li>

            <li>
              <a href="/admin/dashboard/customers">Home</a>
            </li>
            <li>
              <a href="/admin/dashboard/employees">Employees</a>
            </li>
            <li>
              <a href="/admin/dashboard/customers">Customers</a>
            </li>
            <li>
              <a href="/admin/dashboard/inventory">Inventory</a>
            </li>
            <li>
              <a href="/admin/dashboard/sales">Sales</a>
            </li>
            <li>
              <a href="/admin/dashboard/jobs">Jobs</a>
            </li>
            <li>
              <a href="/">Client Website</a>
            </li>
            <li className="user-select-none bg-background hover:bg-background focus:bg-background">
              <AuthButton />
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
