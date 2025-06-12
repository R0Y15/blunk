"use client";

import Link from 'next/link'
import React from 'react'
import {
  FileIcon,
  Globe,
  StarIcon,
  TrashIcon,
  Layers,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'

const navItems = [
  { label: 'All Files', href: '/dashboard/files', icon: FileIcon },
  { label: 'Favourites', href: '/dashboard/favourites', icon: StarIcon },
  { label: 'Global', href: '/dashboard/global', icon: Globe },
  { label: 'Trash', href: '/dashboard/trash', icon: TrashIcon },
]

const SideNav = () => {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="flex flex-col w-60 shrink-0 border-r bg-white h-full">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-base tracking-tight">Blunk</span>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Storage
          </p>
          <nav className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-black text-white shadow-sm'
                          : 'text-muted-foreground hover:bg-zinc-100 hover:text-foreground'
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {item.label}
                      {item.label === 'Trash' && (
                        <span className={cn(
                          'ml-auto text-[10px] font-semibold rounded-full px-1.5 py-0.5',
                          isActive ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
                        )}>
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="hidden">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </nav>
        </ScrollArea>

        <div className="px-3 py-4 border-t space-y-3">
          <Separator className="mb-3" />
          <div className="px-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Workspace
            </p>
            <OrganizationSwitcher
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  organizationSwitcherTrigger: 'w-full justify-start rounded-lg px-2 py-1.5 text-sm hover:bg-zinc-100',
                }
              }}
            />
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: 'w-7 h-7',
                }
              }}
            />
            <span className="text-sm text-muted-foreground truncate">Account</span>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}

export default SideNav
