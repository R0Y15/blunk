"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignOutButton, useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFile);

  return (
    <div>
      <SignedIn>
        <SignOutButton>
          <Button>
            Sign Out
          </Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>

      <Button onClick={() => createFile({ name: "Hello World" })}>
        Create File
      </Button>

      {files?.map((file, idx) => {
        return (
          <div key={idx}>
            {file.name}
          </div>
        )
      })}
    </div>
  );
}
