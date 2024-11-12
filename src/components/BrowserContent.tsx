"use client";

import { FileCard, SearchBar, UploadButton } from '@/components'
import { useQuery } from 'convex/react';
import React, { useState, useEffect } from 'react'
import { useOrganization, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { GridIcon, Loader2, RowsIcon } from 'lucide-react';
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
import { Label } from './ui/label';
import { usePathname, useRouter } from 'next/navigation';

function Placeholder({ path }: { path: string }) {
  const placeholderText = path.split('/').pop();
  return (
    <div className="flex flex-col w-full items-center gap-8 mt-24">
      <Image
        src="/empty.svg"
        alt='Empty'
        width={600}
        height={600}
      />
      <p className='text-2xl'>
        {placeholderText === 'files' && 'You Have No Files, Upload One!'}
        {placeholderText === 'favourites' && 'You Have No Files In Favorites, Mark One!'}
        {placeholderText === 'trash' && 'You Have No Files In Trash'}
      </p>
      <UploadButton />
    </div>
  )
}

const BrowserContent = ({ title, favouritesOnly, deleteOnly }: { title: string, favouritesOnly?: boolean, deleteOnly?: boolean }) => {
  const Organization = useOrganization();
  const user = useUser();
  const path = usePathname();
  const [query, setQueryquery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  let orgId: string | undefined = undefined;
  if (Organization.isLoaded && user.user?.id) {
    orgId = Organization.organization?.id ?? user.user?.id;
  }

  const favs = useQuery(api.files.getAllFavs,
    orgId ? { orgId } : "skip"
  );

  const files = useQuery(api.files.getFile,
    orgId ? { orgId, query, fav: favouritesOnly, deleteOnly, type: type === "all" ? undefined : type } : "skip");

  const modifiedFiles = files?.map((file) => ({
    ...file,
    isFav: (favs ?? [])
      .some((fav) => fav.fileId === file._id
      )
  })) ?? [];

  const router = useRouter();

  useEffect(() => {
    if (files?.length === 0 && !favouritesOnly && !deleteOnly) {
      router.push('/first-upload');
    }
  }, [files, favouritesOnly, deleteOnly]);

  return (
    <div>
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold mb-8">{title}</h1>
          <SearchBar query={query} setQuery={setQueryquery} />
          <UploadButton />
        </div>

        <Tabs defaultValue="grid">
          <div className="flex justify-between items-center">
            <TabsList className='mb-6'>
              <TabsTrigger value="grid" className='flex gap-2 items-center'><GridIcon />Grid</TabsTrigger>
              <TabsTrigger value="table" className='flex gap-2 items-center'><RowsIcon />Table</TabsTrigger>
            </TabsList>

            <div className='flex gap-3 items-center'>
              <Label htmlFor='type-select'>Filter</Label>
              <Select value={type} onValueChange={(newType) => { setType(newType as any) }}>
                <SelectTrigger id='type-select' className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {files === undefined && (
            <div className="flex flex-col w-full items-center gap-8 mt-24">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className='text-2xl'>Loading Files...</p>
            </div>
          )}

          <TabsContent value="grid">
            <div className="grid grid-cols-3 gap-4">
              {modifiedFiles?.map((file) => (
                <FileCard key={file._id} file={file} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="table">
            <FileTable columns={columns} data={modifiedFiles} />
          </TabsContent>
        </Tabs>

        {files?.length === 0 && (<Placeholder path={path} />)}
      </div>
    </div>
  )
}

export default BrowserContent
