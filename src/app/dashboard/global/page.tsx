"use client";

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { FileCard } from '@/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { UploadButton } from '@/components/UploadButton';
import { TextUploadDialog } from '@/components/TextUploadDialog';
import { Globe, Copy, Search, FileIcon } from 'lucide-react';

const GlobalPage = () => {
  const [fileKey, setFileKey] = useState('');
  const { toast } = useToast();
  const files = useQuery(api.files.getGlobalFiles, { fileKey: fileKey || undefined })?.map(file => ({
    ...file,
    isFav: false,
  }));

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 bg-white border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Global Files</h1>
              <p className="text-sm text-muted-foreground">Share files with anyone using a temporary key</p>
            </div>
          </div>
          <div className="flex gap-2">
            <TextUploadDialog />
            <UploadButton isGlobal />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {/* Search section */}
        <div className="bg-white rounded-xl border p-5 space-y-3">
          <div>
            <h2 className="text-sm font-semibold">Find a Shared File</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Enter the file key shared with you to access it.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 bg-zinc-50"
                placeholder="Enter file key..."
                value={fileKey}
                onChange={(e) => setFileKey(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setFileKey('')} disabled={!fileKey}>
              Clear
            </Button>
          </div>
        </div>

        <Separator />

        {/* Files grid */}
        {fileKey && (
          <>
            {files && files.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="gap-1.5">
                  <FileIcon className="w-3 h-3" />
                  {files.length} result{files.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {files?.map((file) => (
                <div key={file._id.toString()} className="relative group">
                  <FileCard file={file} />
                  {file.fileKey && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute bottom-3 right-3 h-7 text-xs gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      onClick={() => {
                        navigator.clipboard.writeText(file.fileKey!);
                        toast({
                          title: "Key copied",
                          description: "Share this key to give others access.",
                        });
                      }}
                    >
                      <Copy className="w-3 h-3" />
                      Copy Key
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {files?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="p-5 rounded-full bg-muted/50">
                  <Search className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium">No file found for this key</p>
                <p className="text-xs text-muted-foreground">The key may be invalid or the file may have expired.</p>
              </div>
            )}
          </>
        )}

        {!fileKey && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="p-5 rounded-full bg-muted/50">
              <Globe className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-medium">Enter a file key to view</p>
            <p className="text-xs text-muted-foreground">Or upload a file to get a shareable key.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalPage;
