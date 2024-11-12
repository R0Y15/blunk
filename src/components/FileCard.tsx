"use client";

import React, { ReactNode } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Doc } from '../../convex/_generated/dataModel'
import { formatDistance } from 'date-fns'

import { FileTextIcon, GanttChartIcon, ImageIcon } from 'lucide-react'
import { api } from '../../convex/_generated/api';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import FileCardActions from './FileActions';
import TextCard from './TextCard';


const FileCard = ({
    file,
    hideDropdown
}: {
    file: Doc<"files"> & { isFav: boolean, url?: string | null }
    hideDropdown?: boolean
}) => {

    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId,
    })

    const currentUser = useQuery(api.users.getMe);
    const isOwner = currentUser?._id === file.userId;

    const typeIcons = {
        image: <ImageIcon />,
        pdf: <FileTextIcon />,
        csv: <GanttChartIcon />,
        text: <FileTextIcon />,
    } as Record<Doc<"files">["type"], ReactNode>;

    return (
        <Card>
            <CardHeader className='relative'>
                <CardTitle className='flex gap-2 text-base font-normal'>
                    <div className='flex justify-center'>{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                {!hideDropdown && (
                    <div className="absolute top-2 right-2">
                        <FileCardActions isFav={file.isFav} file={file} />
                    </div>
                )}
            </CardHeader>
            <CardContent className='h-[200px] overflow-y-hidden flex justify-center items-center mb-3'>
                {file.type === "image" && file.url && (
                    <Image
                        src={file.url}
                        alt={file.name}
                        width={200}
                        height={100}
                    />
                )}
                {file.type === "text" && (
                    <div className="flex flex-col items-center gap-4">
                        <Image
                            src="/text-file.svg"
                            alt="Text file"
                            width={64}
                            height={64}
                        />
                        <p className="text-sm text-gray-500 line-clamp-3">
                            {file.content || "Text"}
                        </p>
                    </div>
                )}
                {file.type === "csv" && <GanttChartIcon className='w-20 h-20' />}
                {file.type === "pdf" && <FileTextIcon className='w-20 h-20' />}
            </CardContent>
            <CardFooter className='flex justify-between'>
                <div className='flex gap-2 text-xs text-gray-700 text-semibold'>
                    <Avatar className='w-6 h-6' >
                        <AvatarImage src={userProfile?.image} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {userProfile?.name}
                </div>

                <div className='text-xs'>
                    Uploaded {formatDistance(new Date(file._creationTime), new Date())}
                </div>
            </CardFooter>
        </Card>
    )
}

export default FileCard
