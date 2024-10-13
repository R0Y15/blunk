"use client";

import { FileCard, UploadButton } from '@/components'
import { useQuery } from 'convex/react';
import React from 'react'
import { api } from '../../convex/_generated/api';
import { useOrganization, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const Organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (Organization.isLoaded && user.user?.id) {
    orgId = Organization.organization?.id ?? user.user?.id;
  }

  // const files = useQuery(api.files.getFile, orgId ? { orgId } : "skip");
  const files = [1, 2, 3]

  return (
    <main className="container mx-auto pt-12">

      {files === undefined && (
        <div className="flex flex-col w-full items-center gap-8 mt-24">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className='text-2xl'>Loading Files...</p>
        </div>
      )}


      {/* {files && files.length === 0 && ( */}
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
      {/* )} */}

      {/* {files && files.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold mb-8">Upload File</h1>
            <UploadButton />
          </div>
          <div className="grid grid-cols-3 gap-4"> */}
            {/* <FileCard file={files} />
            <FileCard file={files} />
            <FileCard file={files} />
            <FileCard file={files} />
            <FileCard file={files} /> */}
            {/* {files?.map((file) => (
              <FileCard key={file._id} file={file} />
            ))}
      </div>
        </>
      )} */}
    </main>
  )
}

export default Home
