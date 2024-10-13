"use client";

import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc } from '../../convex/_generated/dataModel'
import { Button } from './ui/button'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon, TrashIcon } from 'lucide-react'

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

const FileCard = ({ file }: { file: Doc<"files"> }) => {
    return (
        <Card>
            <CardHeader className='relative'>
                <CardTitle>
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions file={file} />
                </div>
                {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <Button>Download</Button>
            </CardFooter>
        </Card>
    )
}

export default FileCard
