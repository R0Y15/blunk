"use client";

import { FileCard, SearchBar, UploadButton } from '@/components'
import { useQuery } from 'convex/react';
import React, { useState, useEffect } from 'react'
import { useOrganization, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { FileIcon, GridIcon, ImageIcon, Loader2, FileTextIcon, RowsIcon, Star, Trash2 } from 'lucide-react';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';
import { columns } from './columns';
import { FileTable } from './FileTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

function EmptyState({ path, showUpload }: { path: string; showUpload?: boolean }) {
  const segment = path.split('/').pop();
  const config = {
    files: {
      icon: <FileIcon className="w-12 h-12 text-muted-foreground/40" />,
      title: 'No files yet',
      description: 'Upload your first file to get started.',
    },
    favourites: {
      icon: <Star className="w-12 h-12 text-muted-foreground/40" />,
      title: 'No favourites',
      description: 'Star files to quickly find them here.',
    },
    trash: {
      icon: <Trash2 className="w-12 h-12 text-muted-foreground/40" />,
      title: 'Trash is empty',
      description: 'Files you delete will appear here.',
    },
  };
  const current = config[segment as keyof typeof config] ?? config.files;

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="p-5 rounded-full bg-muted/50">
        {current.icon}
      </div>
      <div className="text-center space-y-1">
        <p className="text-base font-semibold">{current.title}</p>
        <p className="text-sm text-muted-foreground">{current.description}</p>
      </div>
      {showUpload && (
        <div className="mt-2">
          <UploadButton />
        </div>
      )}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-white overflow-hidden">
          <Skeleton className="h-40 w-full rounded-none" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

const pageConfig: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
  files: {
    title: 'All Files',
    description: 'Manage and organise all your uploaded files',
    icon: <FileIcon className="w-5 h-5" />,
  },
  favourites: {
    title: 'Favourites',
    description: 'Files you have starred for quick access',
    icon: <Star className="w-5 h-5" />,
  },
  trash: {
    title: 'Trash',
    description: 'Deleted files — restore or permanently remove them',
    icon: <Trash2 className="w-5 h-5" />,
  },
};

const BrowserContent = ({
  title,
  favouritesOnly,
  deleteOnly,
}: {
  title: string;
  favouritesOnly?: boolean;
  deleteOnly?: boolean;
}) => {
  const Organization = useOrganization();
  const user = useUser();
  const path = usePathname();
  const segment = path.split('/').pop() ?? 'files';
  const pageInfo = pageConfig[segment] ?? pageConfig.files;

  const [query, setQuery] = useState('');
  const [type, setType] = useState<Doc<'files'>['type'] | 'all'>('all');

  let orgId: string | undefined = undefined;
  if (Organization.isLoaded && user.user?.id) {
    orgId = Organization.organization?.id ?? user.user?.id;
  }

  const favs = useQuery(api.files.getAllFavs, orgId ? { orgId } : 'skip');
  const files = useQuery(
    api.files.getFile,
    orgId
      ? {
          orgId,
          query,
          fav: favouritesOnly,
          deleteOnly,
          type: type === 'all' ? undefined : type,
        }
      : 'skip'
  );

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFav: (favs ?? []).some((fav) => fav.fileId === file._id),
    })) ?? [];

  const router = useRouter();

  useEffect(() => {
    if (files?.length === 0 && !favouritesOnly && !deleteOnly) {
      router.push('/first-upload');
    }
  }, [files, favouritesOnly, deleteOnly]);

  const typeCounts = modifiedFiles.reduce(
    (acc, f) => {
      acc[f.type] = (acc[f.type] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="px-8 pt-8 pb-6 bg-white border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100">
              {pageInfo.icon}
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{pageInfo.title}</h1>
              <p className="text-sm text-muted-foreground">{pageInfo.description}</p>
            </div>
          </div>
          {!deleteOnly && <UploadButton />}
        </div>

        {/* Type stat pills */}
        {files !== undefined && modifiedFiles.length > 0 && (
          <div className="flex items-center gap-2 mt-5 flex-wrap">
            <Badge variant="secondary" className="gap-1.5 font-medium">
              <FileIcon className="w-3 h-3" />
              {modifiedFiles.length} Total
            </Badge>
            {typeCounts.image && (
              <Badge variant="outline" className="gap-1.5">
                <ImageIcon className="w-3 h-3" />
                {typeCounts.image} Images
              </Badge>
            )}
            {typeCounts.pdf && (
              <Badge variant="outline" className="gap-1.5">
                <FileTextIcon className="w-3 h-3" />
                {typeCounts.pdf} PDFs
              </Badge>
            )}
            {typeCounts.csv && (
              <Badge variant="outline" className="gap-1.5">
                {typeCounts.csv} CSV
              </Badge>
            )}
            {typeCounts.text && (
              <Badge variant="outline" className="gap-1.5">
                {typeCounts.text} Text
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Toolbar + Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <Tabs defaultValue="grid">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3 flex-1">
              <div className="max-w-xs flex-1">
                <SearchBar query={query} setQuery={setQuery} />
              </div>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger className="w-36 bg-white">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <TabsList className="bg-zinc-100 p-0.5 h-9">
              <TabsTrigger
                value="grid"
                className="h-8 px-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <GridIcon className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="h-8 px-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <RowsIcon className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Loading */}
          {files === undefined && <LoadingGrid />}

          {/* Empty */}
          {files?.length === 0 && (
            <EmptyState path={path} showUpload={!deleteOnly && !favouritesOnly} />
          )}

          {/* Grid View */}
          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {modifiedFiles.map((file) => (
                <FileCard key={file._id} file={file} />
              ))}
            </div>
          </TabsContent>

          {/* Table View */}
          <TabsContent value="table" className="mt-0">
            <div className="rounded-xl border bg-white overflow-hidden">
              <FileTable columns={columns} data={modifiedFiles} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BrowserContent;
