"use client";

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Upload } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Doc } from "../../convex/_generated/dataModel";
import { useRouter } from 'next/navigation';
import { Separator } from "./ui/separator";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, "Required"),
})

export function UploadButton({ isGlobal }: { isGlobal?: boolean }) {
  const { isSignedIn, user } = useUser();
  const organization = useOrganization();
  const router = useRouter();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { toast } = useToast();

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

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && organization.organization?.id) {
    orgId = organization.organization.id;
  } else if (organization.isLoaded && !organization.organization?.id) {
    orgId = user?.id;
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  })

  const fileRef = form.register("file");
  const createGlobalFile = useMutation(api.files.createGlobalFile);
  const createFile = useMutation(api.files.createFile);

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
          title: "File Shared",
          description: `Key: ${fileKey} · Valid for 10 minutes`,
        });
      } catch {
        toast({ variant: "destructive", title: "Share failed", description: "Please try again." });
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
        await createFile({ name: values.title, fileId: storageId, orgId, type: types[FileType] });
        toast({ variant: "success", title: "File Uploaded", description: "Your file is ready." });
        router.push('/dashboard/files');
      } catch {
        toast({ variant: "destructive", title: "Upload failed", description: "Please try again." });
      }
    }

    form.reset();
    setIsFileDialogOpen(false);
  }

  if (!isSignedIn) return null;

  return (
    <Dialog open={isFileDialogOpen} onOpenChange={(open) => { setIsFileDialogOpen(open); form.reset(); }}>
      <DialogTrigger asChild>
        <Button className="gap-2" size="sm">
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload a File</DialogTitle>
          <DialogDescription>
            {isGlobal
              ? 'Share a file globally. Anyone with the key can access it for 10 minutes.'
              : 'Add a new file to your storage.'}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Project Report Q4" {...field} />
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
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      {...fileRef}
                      className="cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFileDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="gap-2 min-w-24"
              >
                {form.formState.isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
