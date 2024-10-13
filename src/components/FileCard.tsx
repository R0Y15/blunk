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
import { Button } from './ui/button'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileTextIcon, GanttChartIcon, ImageIcon, MoreVerticalIcon, TrashIcon } from 'lucide-react'

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
import { useMutation } from 'convex/react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';


function FileCardActions({ file }: { file: Doc<"files"> }) {

    const { toast } = useToast();
    const deleteFile = useMutation(api.files.deleteFile);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className='bg-red-600 hover:bg-red-700'
                            onClick={() => {
                                // TODO: Delete file
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
                        className='flex gap-1 text-red-600 items-center cursor-pointer'
                        onClick={() => setIsOpen(true)}
                    >
                        <TrashIcon className='w-4 h-4' /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
        </>
    )
}

function getFileUrl(fileId: Id<"_storage">): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
    // https://decisive-trout-680.convex.cloud/api/storage/a1ada88f-f689-4cd6-b43c-5e7988306a2a
}

const FileCard = ({ file }: { file: Doc<"files"> }) => {
    const typeIcons = {
        image: <ImageIcon />,
        pdf: <FileTextIcon />,
        csv: <GanttChartIcon />,
    } as Record<Doc<"files">["type"], ReactNode>;

    return (
        <Card>
            <CardHeader className='relative'>
                <CardTitle className='flex gap-2'>
                    <div className='flex justify-center'>{typeIcons[file.type]} {file.type}</div>
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions file={file} />
                </div>
                {/* <CardDescription>Card Description</CardDescription> */}
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
            <CardFooter className='flex justify-center'>
                <Button
                onClick={() => {
                    window.open(getFileUrl(file.fileId), "_blank")
                }}
                >Download</Button>
            </CardFooter>
        </Card>
    )
}

export default FileCard
