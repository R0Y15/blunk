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
import { FileIcon, MoreVerticalIcon, StarHalf, StarIcon, TrashIcon, UndoIcon, DownloadIcon } from 'lucide-react'

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
import { Protect, useOrganization, useUser } from '@clerk/nextjs';

function FileCardActions({
    isFav,
    file,
}: {
    isFav: boolean;
    file: Doc<"files">;
}) {
    const { toast } = useToast();
    const Organization = useOrganization();
    const user = useUser();
    const moveToTrash = useMutation(api.files.moveToTrash);
    const permanentlyDeleteFile = useMutation(api.files.permanentlyDeleteFile);
    const toggleFav = useMutation(api.files.toggleFav);
    const getFileUrl = useMutation(api.files.getFileUrl);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const restoreFile = useMutation(api.files.restoreFile);

    const currentUser = useQuery(api.users.getMe);
    const isOwner = currentUser?._id === file.userId;

    let orgId: string | undefined = undefined;
    if (Organization.isLoaded && user.user?.id) {
        orgId = Organization.organization?.id ?? user.user?.id;
    }

    const downloadFile = async () => {
        try {
            const fileUrl = await getFileUrl({ fileId: file.fileId });
            
            if (!fileUrl) {
                throw new Error("Could not get file URL");
            }
            
            // For images and PDFs, directly open the URL
            if (file.type === "image" || file.type === "pdf") {
                window.open(fileUrl, '_blank');
                toast({
                    title: "Success",
                    description: "File opened in new tab",
                });
                return;
            }

            // For other file types, trigger download
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch file');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.download = file.name;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Cleanup
            setTimeout(() => {
                window.URL.revokeObjectURL(downloadUrl);
            }, 1000);

            toast({
                title: "Success",
                description: "File downloaded successfully",
            });
        } catch (error) {
            console.error('Error handling file:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to handle file",
            });
        }
    };

    // Helper function to determine content type
    const getContentType = (extension: string | undefined): string => {
        switch (extension) {
            case 'png': return 'image/png';
            case 'jpg':
            case 'jpeg': return 'image/jpeg';
            case 'gif': return 'image/gif';
            case 'pdf': return 'application/pdf';
            case 'csv': return 'text/csv';
            default: return 'application/octet-stream';
        }
    };

    const handleDelete = async () => {
        try {
            if (file.shouldDelete) {
                // If file is already in trash, permanently delete it
                await permanentlyDeleteFile({
                    fileId: file._id,
                });
                toast({
                    title: "File Deleted",
                    description: "File has been permanently deleted",
                });
            } else {
                // Move file to trash
                await moveToTrash({
                    fileId: file._id,
                });
                toast({
                    title: "Moved to Trash",
                    description: "File has been moved to trash",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: file.shouldDelete 
                    ? "Failed to delete file" 
                    : "Failed to move file to trash",
            });
        }
        setIsConfirmOpen(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVerticalIcon className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={downloadFile}>
                        <div className="flex gap-2 items-center">
                            <DownloadIcon className="w-4 h-4" />
                            Download File
                        </div>
                    </DropdownMenuItem>

                    {!file.isGlobal && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    if (!orgId) return;
                                    toggleFav({
                                        fileId: file._id,
                                    });
                                }}
                            >
                                {isFav ? (
                                    <div className="flex gap-2 items-center">
                                        <StarIcon className="w-4 h-4" />
                                        Unfavourite
                                    </div>
                                ) : (
                                    <div className="flex gap-2 items-center">
                                        <StarHalf className="w-4 h-4" />
                                        Favourite
                                    </div>
                                )}
                            </DropdownMenuItem>
                        </>
                    )}

                    {isOwner && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setIsConfirmOpen(true)}
                                className="text-red-600"
                            >
                                <div className="flex gap-2 items-center">
                                    <TrashIcon className="w-4 h-4" />
                                    {file.shouldDelete ? 'Delete Permanently' : 'Move to Trash'}
                                </div>
                            </DropdownMenuItem>
                        </>
                    )}

                    {file.shouldDelete && (
                        <>
                            <DropdownMenuItem
                                onClick={async () => {
                                    try {
                                        await restoreFile({
                                            fileId: file._id,
                                        });
                                        toast({
                                            title: "File Restored",
                                            description: "File has been restored successfully",
                                        });
                                    } catch (error) {
                                        toast({
                                            variant: "destructive",
                                            title: "Error",
                                            description: "Failed to restore file",
                                        });
                                    }
                                }}
                            >
                                <div className="flex gap-2 items-center">
                                    <UndoIcon className="w-4 h-4" />
                                    Restore
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {file.shouldDelete 
                                ? "This action cannot be undone. This will permanently delete your file."
                                : "This will move the file to trash. You can restore it later."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            {file.shouldDelete ? 'Delete Permanently' : 'Move to Trash'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default FileCardActions;