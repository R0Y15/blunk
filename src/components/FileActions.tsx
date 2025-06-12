"use client";

import React, { useState } from 'react'
import { Doc } from '../../convex/_generated/dataModel'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Star,
  StarOff,
  Trash2,
  Undo2,
  Download,
} from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { api } from '../../convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useToast } from '@/hooks/use-toast';
import { useOrganization, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

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
  const restoreFile = useMutation(api.files.restoreFile);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const currentUser = useQuery(api.users.getMe);
  const isOwner = currentUser?._id === file.userId;

  let orgId: string | undefined = undefined;
  if (Organization.isLoaded && user.user?.id) {
    orgId = Organization.organization?.id ?? user.user?.id;
  }

  const downloadFile = async () => {
    try {
      const fileUrl = await getFileUrl({ fileId: file.fileId });
      if (!fileUrl) throw new Error("Could not get file URL");

      if (file.type === "image" || file.type === "pdf") {
        window.open(fileUrl, '_blank');
        toast({ title: "Opened in new tab" });
        return;
      }

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Failed to fetch file');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1000);

      toast({ title: "Downloaded", description: file.name });
    } catch {
      toast({ variant: "destructive", title: "Download failed", description: "Please try again." });
    }
  };

  const handleDelete = async () => {
    try {
      if (file.shouldDelete) {
        await permanentlyDeleteFile({ fileId: file._id });
        toast({ title: "Permanently deleted" });
      } else {
        await moveToTrash({ fileId: file._id });
        toast({ title: "Moved to Trash", description: "You can restore it from Trash." });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Action failed. Please try again." });
    }
    setIsConfirmOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7 rounded-lg shadow-sm bg-white/90 hover:bg-white"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
            <span className="sr-only">File actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={downloadFile} className="gap-2 cursor-pointer">
            <Download className="w-4 h-4" />
            Download
          </DropdownMenuItem>

          {!file.isGlobal && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => { if (orgId) toggleFav({ fileId: file._id }); }}
                className="gap-2 cursor-pointer"
              >
                {isFav ? (
                  <><StarOff className="w-4 h-4" /> Remove from Favourites</>
                ) : (
                  <><Star className="w-4 h-4" /> Add to Favourites</>
                )}
              </DropdownMenuItem>
            </>
          )}

          {file.shouldDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await restoreFile({ fileId: file._id });
                    toast({ title: "Restored", description: "File has been restored." });
                  } catch {
                    toast({ variant: "destructive", title: "Restore failed" });
                  }
                }}
                className="gap-2 cursor-pointer"
              >
                <Undo2 className="w-4 h-4" />
                Restore
              </DropdownMenuItem>
            </>
          )}

          {isOwner && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsConfirmOpen(true)}
                className={cn("gap-2 cursor-pointer", "text-destructive focus:text-destructive focus:bg-destructive/10")}
              >
                <Trash2 className="w-4 h-4" />
                {file.shouldDelete ? 'Delete Permanently' : 'Move to Trash'}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {file.shouldDelete ? 'Delete permanently?' : 'Move to Trash?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {file.shouldDelete
                ? 'This action is irreversible. The file will be gone forever.'
                : 'The file will be moved to Trash. You can restore it later.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className={file.shouldDelete ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : ''}
            >
              {file.shouldDelete ? 'Delete Permanently' : 'Move to Trash'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default FileCardActions;
