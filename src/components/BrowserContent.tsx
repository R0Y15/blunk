"use client";

import { FileCard, SearchBar, UploadButton } from '@/components'
import { useQuery } from 'convex/react';
import React, { useState } from 'react'
import { useOrganization, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { FileIcon, Loader2, StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { boolean } from 'zod';
import { api } from '../../convex/_generated/api';

function Placeholder() {
  return (
    <div className="flex flex-col w-full items-center gap-8 mt-24">
      <Image
        src="/empty.svg"
        alt='Empty'
        width={600}
        height={600}
      />
      <p className='text-2xl'>You Have No Files, Upload One!</p>
      <UploadButton />
    </div>
  )
}

const BrowserContent = ({ title, favouritesOnly }: { title: string, favouritesOnly?: boolean }) => {
  const Organization = useOrganization();
  const user = useUser();
  const [query, setQueryquery] = useState("");

  let orgId: string | undefined = undefined;
  if (Organization.isLoaded && user.user?.id) {
    orgId = Organization.organization?.id ?? user.user?.id;
  }

  // const favs = useQuery(api.files.getAllFavs,
  //   orgId ? { orgId } : "skip"
  // );

  // const files = useQuery(api.files.getFile,
  //   orgId ? { orgId, query, fav: favouritesOnly } : "skip");
  const files = [1, 2, 3];
  const isLoading = files === undefined;

  return (
    <div>
      <div className="w-full">
        {files === undefined && (
          <div className="flex flex-col w-full items-center gap-8 mt-24">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className='text-2xl'>Loading Files...</p>
          </div>
        )}

        {!isLoading && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold mb-8">{title}</h1>
              <SearchBar query={query} setQuery={setQueryquery} />
              <UploadButton />
            </div>

            {files.length === 0 && (<Placeholder />)}

            {/* <div className="grid grid-cols-3 gap-4"> */}
            {/* <FileCard file={files} />
            <FileCard file={files} />
            <FileCard file={files} />
            <FileCard file={files} />
            <FileCard file={files} /> */}
            {/* {files?.map((file) => (
              <FileCard key={file._id} favourites={favs ?? []} file={file} />
            ))} */}
            {/* </div> */}
            {/* )} */}
          </>
        )}
      </div>
    </div>
  )
}

export default BrowserContent
