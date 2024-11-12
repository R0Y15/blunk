"use client";

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Doc } from "../../convex/_generated/dataModel";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    title: z.string().min(1).max(200),
    file: z
        .custom<FileList>((val) => val instanceof FileList, "Required")
        .refine((files) => files.length > 0, "Required"),
})

export function UploadButton({ isGlobal }: { isGlobal?: boolean }) {
    const { isSignedIn, user } = useUser();
    
    if (!isSignedIn) {
        return null;
    }

    const organization = useOrganization();
    const router = useRouter();
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { toast } = useToast();
    let orgId: string | undefined = undefined;

    const types = {
        "image/png": "image",
        "image/jpg": "image",
        "image/jpeg": "image",
        "image/HEIC": "image",
        "application/pdf": "pdf",
        "application/doc": "doc",
        "application/docx": "doc",
        "application/zip": "zip",
        "text/plain": "text",
        "text/csv": "csv",
        "text/txt": "csv",
        "text/xlsx": "csv",
        "text/xls": "csv",
    } as Record<string, Doc<"files">["type"]>;

    if (organization.isLoaded && organization.organization?.id) {
        orgId = organization.organization.id;
    } else if (organization.isLoaded && !organization.organization?.id) {
        orgId = user?.id;
    }

    const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    })

    const fileRef = form.register("file");

    const createGlobalFile = useMutation(api.files.createGlobalFile);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (isGlobal) {
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": values.file[0].type },
                body: values.file[0],
            });

            const { storageId } = await result.json();
            
            try {
                const fileKey = await createGlobalFile({
                    name: values.title,
                    fileId: storageId,
                    type: types[values.file[0].type],
                    isGlobal: true
                });

                toast({
                    variant: "success",
                    title: "File Shared Successfully",
                    description: `File Key: ${fileKey} (valid for 10 minutes)`,
                });
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error sharing file",
                    description: "Please try again later",
                });
            }
        } else {
            if (!orgId) return;

            const FileType = values.file[0].type;
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": FileType },
                body: values.file[0],
            });

            const { storageId } = await result.json();

            try {
                await createFile({
                    name: values.title,
                    fileId: storageId,
                    orgId,
                    type: types[FileType]
                })

                toast({
                    variant: "success",
                    title: "File Uploaded",
                    description: "Your file has been uploaded successfully",
                })

                router.push('/dashboard/files');
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Something went wrong",
                    description: "Please try again later",
                })
            }
        }

        form.reset();
        setIsFileDialogOpen(false);
    }

    const createFile = useMutation(api.files.createFile);

    return (
        <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
            setIsFileDialogOpen(isOpen)
            form.reset();
        }}>
            <DialogTrigger asChild>
                <Button className="font-semibold">
                    Upload File
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-4">Add New File</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="File Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="file"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Your File</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file" {...fileRef}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={form.formState.isSubmitting}
                            type="submit"
                            className="flex gap-1"
                        >
                            {form.formState.isSubmitting && (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                            Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
