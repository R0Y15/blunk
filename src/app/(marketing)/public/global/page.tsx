"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import FileCard from "@/components/FileCard";
import { Eye, Copy, Check, Search, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { TextUploadDialog } from "@/components/TextUploadDialog";
import { UploadButton } from "@/components/UploadButton";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import React from 'react';

const PublicGlobalPage = () => {
    const [fileKey, setFileKey] = useState("");
    const { toast } = useToast();
    const files = useQuery(api.files.getPublicGlobalFiles, { fileKey: fileKey || undefined });
    const getFileUrl = useMutation(api.files.getFileUrl);
    const [copiedFileId, setCopiedFileId] = useState<string | null>(null);
    const { isSignedIn } = useUser();

    const viewFile = async (fileId: Id<"_storage">, fileName: string, fileType: string) => {
        try {
            const fileUrl = await getFileUrl({ fileId });
            if (!fileUrl) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No URL available for file",
                });
                return;
            }

            if (fileType === "image" || fileType === "pdf") {
                window.open(fileUrl, '_blank');
                return;
            }

            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const fileBlob = new Blob([blob], { type: "application/octet-stream" });
            const blobUrl = window.URL.createObjectURL(fileBlob);

            window.open(blobUrl, '_blank');

            setTimeout(() => {
                window.URL.revokeObjectURL(blobUrl);
            }, 1000);

            toast({
                title: "Success",
                description: "File opened in new tab",
            });
        } catch (error) {
            console.error('Error opening file:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to open file",
            });
        }
    };

    const handleCopyText = async (fileId: Id<"_storage">) => {
        try {
            const fileUrl = await getFileUrl({ fileId });
            if (!fileUrl) {
                throw new Error("No URL available for file");
            }

            const response = await fetch(fileUrl);
            const text = await response.text();
            await navigator.clipboard.writeText(text);

            setCopiedFileId(fileId.toString());
            setTimeout(() => setCopiedFileId(null), 2000);

            toast({
                title: "Copied!",
                description: "Text copied to clipboard",
            });
        } catch (error) {
            console.error('Error copying text:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to copy text",
            });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileKey.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please enter a file key",
            });
            return;
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Globe className="w-8 h-8" />
                    <div>
                        <h1 className="text-3xl font-bold">Global Files</h1>
                        <p className="text-sm text-muted-foreground">Find and view publicly shared files</p>
                    </div>
                </div>
                {isSignedIn && (
                    <div className="flex gap-2">
                        <TextUploadDialog />
                        <UploadButton isGlobal={true} />
                    </div>
                )}
            </div>

            <Separator className="mb-8" />

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Find Shared File</h2>
                <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Enter file key..."
                            value={fileKey}
                            onChange={(e) => setFileKey(e.target.value)}
                        />
                    </div>
                    <Button type="submit">Search</Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFileKey("")}
                    >
                        Clear
                    </Button>
                </form>
            </div>

            {fileKey ? (
                <>
                    {files && files.length > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="secondary">{files.length} file{files.length !== 1 ? 's' : ''} found</Badge>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {files?.map((file, index) => (
                            <div key={file._id.toString()} className="relative">
                                <FileCard file={{ ...file, isFav: false }} hideDropdown priority={index === 0} />
                                <div className="absolute top-2 right-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className={cn(
                                            "transition-all duration-200",
                                            copiedFileId === file.fileId.toString() && "bg-green-100 text-green-700"
                                        )}
                                        onClick={() =>
                                            file.type === "text"
                                                ? handleCopyText(file.fileId)
                                                : viewFile(file.fileId, file.name, file.type)
                                        }
                                    >
                                        {file.type === "text" ? (
                                            copiedFileId === file.fileId.toString() ? (
                                                <React.Fragment key={`copied-${file._id}`}>
                                                    <Check className="w-4 h-4 mr-1.5" />
                                                    Copied!
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment key={`copy-${file._id}`}>
                                                    <Copy className="w-4 h-4 mr-1.5" />
                                                    Copy Text
                                                </React.Fragment>
                                            )
                                        ) : (
                                            <React.Fragment key={`view-${file._id}`}>
                                                <Eye className="w-4 h-4 mr-1.5" />
                                                View File
                                            </React.Fragment>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {files?.length === 0 && (
                            <div key="no-files" className="col-span-3 text-center py-16">
                                <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-lg font-medium text-muted-foreground">
                                    No files found for this key
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    The file may not exist or may have expired.
                                </p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div key="enter-key" className="text-center py-16">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                        Enter a file key to view shared files
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        File keys are provided when files are shared publicly.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PublicGlobalPage;
