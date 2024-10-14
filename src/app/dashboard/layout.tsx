import { SideNav } from '@/components';
import { Button } from '@/components/ui/button';
import { FileIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto pt-12">
      <div className="flex gap-8">
        <SideNav />

        <div className="w-full">
          {children}
        </div>
      </div>
    </main >
  );
}
