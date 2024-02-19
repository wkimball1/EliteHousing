// @/components/Layout/Sidebar.js
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

import { SlHome } from 'react-icons/sl'
import { BsInfoSquare, BsEnvelopeAt } from 'react-icons/bs'
import { FaTshirt, FaRedhat } from 'react-icons/fa'
import { MdOutlineWeb } from "react-icons/md";
import defaultLogo from '@/img/logo.png';
import darkLogo from '@/img/logo-white.png';


export default function Sidebar({show, setter} : {show:any, setter:Function}) {
    const router = useRouter();
    const pathname = usePathname();

    // Define our base class
    const className = "bg-background/50 w-[250px] transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40";
    // Append class based on state of sidebar visiblity
    const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";

    // Clickable menu items
    const MenuItem = ({icon, name, route} : { icon:any, name:any, route:any }) => {
        // Highlight menu item based on currently displayed route
        const colorClass = pathname === route ? "text-foreground" : "text-foreground/50 hover:text-foreground";

        return (
            <Link
                href={route}
                onClick={() => {
                    setter((oldVal: any) => !oldVal);
                }}
                className={`flex gap-1 [&>*]:my-auto text-md pl-6 py-3 border-b-[1px] border-background/10 ${colorClass}`}
            >
                <div className="text-xl flex [&>*]:mx-auto w-[30px]">
                    {icon}
                </div>
                <div>{name}</div>
            </Link>
        )
    }

    // Overlay to prevent clicks in background, also serves as our close button
    const ModalOverlay = () => (
        <div
            className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-background z-30`}
            onClick={() => {
                setter((oldVal:any) => {
                    return !oldVal
                });
            }}
        />
    )

    return (
        <>
            <div className={`${className}${appendClass}`}>
                <div className="p-2 flex">
                    <Link href="/admin/dashboard" onClick={() => {
                        setter((oldVal: any) => !oldVal);
                    }}>
                        <img src={defaultLogo.src} alt="Company Logo" width={150} height={150} className="lightLogo"/>
                        <img src={darkLogo.src} alt="Company Logo" width={150} height={150} className="darkLogo"/>
                        
                    </Link>
                </div>
                <div className="flex flex-col">
                    <MenuItem
                        name="Home"
                        route="/admin/dashboard"
                        icon={<SlHome />}
                    />
                    <MenuItem
                        name="T-Shirts"
                        route="/t-shirts"
                        icon={<FaTshirt />}
                    />
                    <MenuItem
                        name="Hats"
                        route="/hats"
                        icon={<FaRedhat />}
                    />
                    <MenuItem
                        name="About Us"
                        route="/about"
                        icon={<BsInfoSquare />}
                    />
                    <MenuItem
                        name="Client Website"
                        route="/"
                        icon={<MdOutlineWeb/>}
                    />
                </div>
            </div>
            {show ? <ModalOverlay /> : <></>}
        </>
    )
}