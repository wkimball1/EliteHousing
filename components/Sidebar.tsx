// @/components/Layout/MenuBarMobile.js
import React from "react";
import Link from "next/link";
import { FiMenu as Icon } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import defaultLogo from "@/img/logo.png";
import darkLogo from "@/img/logo-white.png";
import AuthButton from "./AuthButton";

export default function SideBar() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-start justify-start">
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
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li>
            <Link href="/admin/dashboard">
              <img
                src={defaultLogo.src}
                alt="Company Logo"
                width={150}
                height={150}
                className="lightLogo"
              />
              <img
                src={darkLogo.src}
                alt="Company Logo"
                width={150}
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
          <li>
            <AuthButton />
          </li>
        </ul>
      </div>
    </div>
  );
}
