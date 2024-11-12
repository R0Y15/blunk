"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileCard from "@/components/FileCard";
import { Eye, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
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

            // For images and PDFs, directly open the URL
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
                className: "copy-toast-animation",
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
        <>
            <style jsx global>{`
                @keyframes splashAnimation {
                    0% { transform: scale(0.8); opacity: 0; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                .copy-toast-animation {
                    animation: splashAnimation 0.3s ease-out forwards;
                }
                
                .copy-success {
                    animation: splashAnimation 0.3s ease-out forwards;
                }
            `}</style>
            
            <div className="container max-w-screen-xl mx-auto px-4 p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Global Files</h1>
                    {isSignedIn && (
                        <div className="flex gap-2">
                            <TextUploadDialog />
                            <UploadButton isGlobal={true} />
                        </div>
                    )}
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Find Shared File</h2>
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <Input
                            placeholder="Enter file key"
                            value={fileKey}
                            onChange={(e) => setFileKey(e.target.value)}
                        />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {files?.map((file) => (
                            <div key={file._id.toString()} className="relative">
                                <FileCard file={{ ...file, isFav: false }} hideDropdown />
                                <div className="absolute top-2 right-2">
                                    <Button
                                        variant="secondary"
                                        className={cn(
                                            "w-full transition-all duration-200",
                                            copiedFileId === file.fileId.toString() && "copy-success"
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
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Copied!
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment key={`copy-${file._id}`}>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy Text
                                                </React.Fragment>
                                            )
                                        ) : (
                                            <React.Fragment key={`view-${file._id}`}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                View File
                                            </React.Fragment>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {files?.length === 0 && (
                            <div key="no-files" className="col-span-3 text-center mt-12">
                                <p className="text-lg text-gray-600">
                                    No files found for this key or the file has expired.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div key="enter-key" className="text-center mt-12">
                        <p className="text-lg text-gray-600">
                            Enter a file key to view shared files.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default PublicGlobalPage; 