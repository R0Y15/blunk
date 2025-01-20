import { SideNav } from '@/components';
import React from 'react'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <SideNav />
      <main className="flex-1 overflow-y-auto bg-zinc-50/50">
        {children}
      </main>
    </div>
  );
}
