"use client"

import { Button } from "@/components/ui/button";
import { menuitems } from "@/constants";
import {
  OrganizationSwitcher,
  SignInButton,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="flex flex-col lg:flex-row justify-between items-center my-5 max-w-screen-xl mx-auto px-5">
        <div className="flex w-full lg:w-auto items-center justify-between">
          <a href="/" className="text-lg">
            <span className="font-bold text-slate-800">Blunk</span>
          </a>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="block lg:hidden"
          >
            <MenuIcon className="w-4 h-4 text-gray-800" />
          </button>
        </div>

        <div className={`
          fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden
          ${isMenuOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'}
        `} onClick={() => setIsMenuOpen(false)} />

        <div className={`
          fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform lg:hidden
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <ul className="flex flex-col p-4 mt-8 items-start py-2">
            {menuitems.map((item, index) => (
              <li key={index}>
                {item.children && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>{item.title}</DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {item.children.map((child, idx) => (
                        <DropdownMenuItem key={idx}>{child.title}</DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {!item.children && (
                  <a
                    href={item.path}
                    className="flex lg:px-3 py-2 items-center text-gray-600 hover:text-gray-900">
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-1 px-2 py-0.5 text-[10px] animate-pulse font-semibold uppercase text-white bg-indigo-600 rounded-full">
                        coming soon
                      </span>
                    )}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="p-4 border-t">
            <Button variant={"ghost"} className="w-full mb-2">Log in</Button>
            <Button className="w-full">Sign up</Button>
          </div>
        </div>

        <ul className="hidden lg:flex lg:flex-row lg:gap-3 items-center justify-center">
          {menuitems.map((item, index) => (
            <li key={index}>
              {item.children && (
                <DropdownMenu>
                  <DropdownMenuTrigger>{item.title}</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {item.children.map((child, idx) => (
                      <DropdownMenuItem key={idx}>{child.title}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {!item.children && (
                <a
                  href={item.path}
                  className="flex lg:px-3 py-2 items-center text-gray-600 hover:text-gray-900">
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-1 px-2 py-0.5 text-[10px] animate-pulse font-semibold uppercase text-white bg-indigo-600 rounded-full">
                      coming soon
                    </span>
                  )}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          <div className="flex gap-2">
            <OrganizationSwitcher />
            <UserButton />
            <SignedOut>
              <SignInButton>
                <Button>Sign up</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar