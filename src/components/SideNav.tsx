"use client";

import Link from 'next/link'
import { Button } from './ui/button'
import React from 'react'
import { FileIcon, Globe, StarIcon, TrashIcon } from 'lucide-react'
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

            <Link href="/dashboard/global">
                <Button variant={"link"} className={`flex gap-2 ${pathname === "/dashboard/global" ? "text-blue-500" : ""}`}>
                    <Globe /> Global
                </Button>
            </Link>

            <Link href="/dashboard/trash">
                <Button variant={"link"} className={`flex gap-2 ${pathname === "/dashboard/trash" ? "text-blue-500" : ""}`}>
                    <TrashIcon /> Trash
                </Button>
            </Link>
        </div>
    )
}

export default SideNav