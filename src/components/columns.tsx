"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doc, Id } from "../../convex/_generated/dataModel"
import { formatDistance } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import FileCardActions from "./FileActions"

function UserCell({ userId }: { userId: Id<"users"> }) {
    const userProfile = useQuery(api.users.getUserProfile, {
        userId: userId
    })
    return (
        <div className='flex gap-2 text-xs text-gray-700 text-semibold'>
            <Avatar className='w-6 h-6' >
                <AvatarImage src={userProfile?.image} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {userProfile?.name}
        </div>
    )
}

export const columns: ColumnDef<Doc<"files"> & { isFav: boolean }>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        header: "User",
        cell: ({ row }) => {
            return <UserCell userId={row.original.userId} />
        },
    },
    {
        header: "Created At",
        cell: ({ row }) => {
            return (
                <div>
                    {formatDistance(new Date(row.original._creationTime), new Date())}
                </div>
            )
        },
    },
    {
        header: "Actions",
        cell: ({ row }) => {
            return (
                <div>
                    <FileCardActions
                        file={row.original}
                        isFav={row.original.isFav}
                    />
                </div>
            )
        },
    }
]
