// @/components/Layout/MenuBarMobile.js
import React from 'react'
import Link from 'next/link'
import { FiMenu as Icon } from 'react-icons/fi'
import { FaUser } from 'react-icons/fa'
import defaultLogo from '@/img/logo.png';
import darkLogo from '@/img/logo-white.png';

import logo from '@/img/logo.png'

export default function MenuBarMobile( {setter} : {setter:Function} ) {
    return (
        <nav className="md:hidden z-20 fixed top-0 left-0 right-0 h-[60px] bg-black flex [&>*]:my-auto px-2">
            <button
                className="text-4xl flex text-white"
                onClick={() => {
                    setter((oldVal: any) => !oldVal);
                }}
            >
                <Icon />
            </button>
            <Link href="/" className="mx-auto">
                {/*eslint-disable-next-line*/}
                <img src={defaultLogo.src} alt="Company Logo" width={50} height={50} className="lightLogo"/>
          <img src={darkLogo.src} alt="Company Logo" width={50} height={50} className="darkLogo"/>
            </Link>
            <Link
                className="text-3xl flex text-white"
                href="/login"
            >
                <FaUser />
            </Link>
        </nav>
    )
}