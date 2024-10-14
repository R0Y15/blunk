"use client";

import Link from 'next/link'
import { Button } from './ui/button'
import React from 'react'
import { FileIcon, StarIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

const SideNav = () => {
    const pathname = usePathname();

    return (
        <div className="w-40 flex flex-col gap-4">
            <Link href="/dashboard/files">
                <Button variant={"link"} className={`flex gap-2 ${pathname === "/dashboard/files" ? "text-blue-500" : ""}`}>
                    <FileIcon /> All Files
                </Button>
            </Link>

            <Link href="/dashboard/favourites">
                <Button variant={"link"} className={`flex gap-2 ${pathname === "/dashboard/favourites" ? "text-blue-500" : ""}`}>
                    <StarIcon /> Favourites
                </Button>
            </Link>
        </div>
    )
}

export default SideNav