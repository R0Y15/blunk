"use client";

import { FileCard, UploadButton } from '@/components'
import { useQuery } from 'convex/react';
import React from 'react'
import { api } from '../../convex/_generated/api';
import { useOrganization, useUser } from '@clerk/nextjs';

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
    <div className="container mx-auto pt-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold mb-8">Upload File</h1>
        <UploadButton />


        {/* {files?.map((file) => (
          <div key={file._id}>{file.name}</div>
          ))} */}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <FileCard file={files} />
        <FileCard file={files} />
        <FileCard file={files} />
        <FileCard file={files} />
        <FileCard file={files} />
      </div>
    </div>
  )
}

export default Home