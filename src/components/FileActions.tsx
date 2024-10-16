"use client";

import React, { useState } from 'react'
import { Doc, Id } from '../../convex/_generated/dataModel'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileIcon, MoreVerticalIcon, StarHalf, StarIcon, TrashIcon, UndoIcon } from 'lucide-react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { api } from '../../convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useToast } from '@/hooks/use-toast';
import { Protect } from '@clerk/nextjs';

// File URL
export function getFileUrl(fileId: Id<"_storage">): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}
// 4:8:28

function FileCardActions({ file, isFav }: {
    file: Doc<"files"> & { url: string | null };
    isFav: boolean;
}) {

    const { toast } = useToast();
    const fav = useMutation(api.files.toggleFav);
    const deleteFile = useMutation(api.files.deleteFile);
    const restoreFile = useMutation(api.files.restoreFile);
    const me = useQuery(api.users.getMe);
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
                            if (!file.url) return;
                            window.open(file.url, "_blank")
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
                        condition={(check) => {
                            return check({
                                role: "org:admin"
                            }) || file.userId === me?._id;
                        }}
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

export default FileCardActions;