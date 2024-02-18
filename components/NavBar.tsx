import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import AuthButton from './AuthButton'

export default function NavBar() {
  return (
    <nav
      className="sticky top-0 z-10 block w-full max-w-full px-4 py-2 text-white bg-white border rounded-none shadow-md h-max border-white/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between text-gray-900">
        <a href="/"
          className="mr-4 block cursor-pointer py-1.5 font-sans text-base font-medium leading-relaxed text-inherit antialiased">
          Elite Housing
        </a>
        <div className="flex items-center gap-4">
          <div className="hidden mr-4 lg:block">
            <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal text-gray-900">
                <a href="/notes" className="flex items-center">
                  Notes
                </a>
              </li>
              <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal text-gray-900">
                <a href="/admin/dashboard" className="flex items-center">
                  Dashboard
                </a>
              </li>
              <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal text-gray-900">
                <a href="#" className="flex items-center">
                  Blocks
                </a>
              </li>
              <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal text-gray-900">
                <a href="#" className="flex items-center">
                  Docs
                </a>
              </li>
              <li className="block p-2 font-sans text-sm antialiased font-normal leading-normal text-gray-900">
              <AuthButton/>
              </li>
            </ul>
            
          </div>
        </div>
      </div>
    </nav>
  )
}
