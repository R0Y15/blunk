"use client";

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { FileCard, SearchBar } from '@/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UploadButton } from '@/components/UploadButton';
import { TextUploadDialog } from '@/components/TextUploadDialog';

const GlobalPage = () => {
  const [fileKey, setFileKey] = useState("");
  const { toast } = useToast();
  const files = useQuery(api.files.getGlobalFiles, { fileKey: fileKey || undefined })?.map(file => ({
    ...file,
    isFav: false
  }));

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Global Files</h1>
        <div className="flex gap-2">
          <TextUploadDialog />
          <UploadButton isGlobal={true} />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Find Shared File</h2>
        <div className="flex gap-4">
          <Input
            placeholder="Enter file key"
            value={fileKey}
            onChange={(e) => setFileKey(e.target.value)}
          />
          <Button onClick={() => setFileKey("")}>Clear</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files?.map((file) => (
          <div key={file._id} className="relative">
            <FileCard file={file} />
            {!fileKey && file.fileKey && (
              <Button
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => {
                  navigator.clipboard.writeText(file.fileKey!);
                  toast({
                    title: "File key copied!",
                    description: "Share this key with others to give them access to the file.",
                  });
                }}
              >
                Copy Key
              </Button>
            )}
          </div>
        ))}
      </div>

      {files?.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          {fileKey ? 
            "Invalid file key or file has expired." : 
            "No global files found. Upload a file and share its key to collaborate!"}
        </div>
      )}
    </div>
  );
};

export default GlobalPage;