"use client";

import React, { ReactNode, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc, Id } from '../../convex/_generated/dataModel'
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileIcon, FileTextIcon, GanttChartIcon, ImageIcon, MoreVerticalIcon, StarHalf, StarIcon, TrashIcon, UndoIcon } from 'lucide-react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { api } from '../../convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Protect } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


function FileCardActions({ file, isFav }: { file: Doc<"files">, isFav: boolean }) {

    const { toast } = useToast();
    const fav = useMutation(api.files.toggleFav);
    const deleteFile = useMutation(api.files.deleteFile);
    const restoreFile = useMutation(api.files.restoreFile);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will mark your file for deletion. The file will be permanently deleted from our servers soon. You can always recover the file from the trash bin within 7 days.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className='bg-red-600 hover:bg-red-700'
                            onClick={() => {
                                deleteFile({ fileId: file._id })
                                toast({
                                    variant: "default",
                                    title: "File Deleted",
                                    description: "You Can Recover the File From The TrashBin",
                                })
                            }}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger><MoreVerticalIcon /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        className='flex gap-1 items-center cursor-pointer'
                        onClick={() => {
                            window.open(getFileUrl(file.fileId), "_blank")
                        }}
                    >
                        <FileIcon className='w-4 h-4' /> Download
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className='flex gap-1 items-center cursor-pointer'
                        onClick={() => fav({ fileId: file._id })}
                    >
                        {isFav ? (
                            <div className='flex gap-1 items-center'>
                                <StarIcon className='w-4 h-4' /> UnFavourite
                            </div>
                        ) : (
                            <div className='flex gap-1 items-center'>
                                <StarHalf className='w-4 h-4' /> Favourite
                            </div>
                        )}
                    </DropdownMenuItem>

                    <Protect
                        role='org:admin'
                        fallback={<></>}
                    >
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className='flex gap-1 items-center cursor-pointer'
                            onClick={() => {
                                if (file.shouldDelete) {
                                    restoreFile({ fileId: file._id })
                                } else {
                                    setIsOpen(true)
                                }
                            }}
                        >
                            {file.shouldDelete ? (
                                <div className='flex gap-1 text-green-600 items-center cursor-pointer'>
                                    <UndoIcon className='w-4 h-4' /> Restore
                                </div>
                            ) : (
                                <div className='flex gap-1 text-red-600 items-center cursor-pointer'>
                                    <TrashIcon className='w-4 h-4' /> Delete
                                </div>
                            )}
                            {/* <TrashIcon className='w-4 h-4' /> Delete */}
                        </DropdownMenuItem>
                    </Protect>
                </DropdownMenuContent>
            </DropdownMenu >
        </>
    )
}

function getFileUrl(fileId: Id<"_storage">): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
    // https://decisive-trout-680.convex.cloud/api/storage/a1ada88f-f689-4cd6-b43c-5e7988306a2a
}

const FileCard = ({ file, favourites }: { file: Doc<"files">, favourites: Doc<"favourites">[] }) => {

    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId,
    })

    const typeIcons = {
        image: <ImageIcon />,
        pdf: <FileTextIcon />,
        csv: <GanttChartIcon />,
    } as Record<Doc<"files">["type"], ReactNode>;

    const isFav = favourites.some((fav) => fav.fileId === file._id);

    return (
        <Card>
            <CardHeader className='relative'>
                <CardTitle className='flex gap-2 text-base font-normal'>
                    <div className='flex justify-center'>{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions isFav={isFav} file={file} />
                </div>
            </CardHeader>
            <CardContent className='h-[200px] flex justify-center items-center'>
                {file.type === "image" && (
                    <Image
                        src={file.fileId}
                        alt={file.name}
                        width={200}
                        height={100}
                    />
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
