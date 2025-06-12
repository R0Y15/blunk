"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doc, Id } from "../../convex/_generated/dataModel"
import { formatDistance } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import FileCardActions from "./FileActions"
import { Badge } from "./ui/badge"
import { FileTextIcon, GanttChartIcon, ImageIcon, FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const typeConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  image: { icon: <ImageIcon className="w-3 h-3" />, label: 'Image', color: 'text-blue-600', bg: 'bg-blue-50' },
  pdf: { icon: <FileTextIcon className="w-3 h-3" />, label: 'PDF', color: 'text-red-600', bg: 'bg-red-50' },
  csv: { icon: <GanttChartIcon className="w-3 h-3" />, label: 'CSV', color: 'text-green-600', bg: 'bg-green-50' },
  text: { icon: <FileTextIcon className="w-3 h-3" />, label: 'Text', color: 'text-violet-600', bg: 'bg-violet-50' },
};

function UserCell({ userId }: { userId: Id<"users"> }) {
  const userProfile = useQuery(api.users.getUserProfile, { userId })
  return (
    <div className="flex items-center gap-2">
      <Avatar className="w-6 h-6">
        <AvatarImage src={userProfile?.image} />
        <AvatarFallback className="text-[9px]">
          {userProfile?.name?.charAt(0) ?? 'U'}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm text-muted-foreground">{userProfile?.name ?? '—'}</span>
    </div>
  )
}

export const columns: ColumnDef<Doc<"files"> & { isFav: boolean }>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-sm">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const cfg = typeConfig[row.original.type] ?? {
        icon: <FileIcon className="w-3 h-3" />,
        label: row.original.type,
        color: 'text-zinc-600',
        bg: 'bg-zinc-100',
      };
      return (
        <Badge
          variant="secondary"
          className={cn('gap-1 font-medium text-xs border-0', cfg.color, cfg.bg)}
        >
          {cfg.icon}
          {cfg.label}
        </Badge>
      );
    },
  },
  {
    header: "Uploaded by",
    cell: ({ row }) => <UserCell userId={row.original.userId} />,
  },
  {
    header: "Created",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDistance(new Date(row.original._creationTime), new Date(), { addSuffix: true })}
      </span>
    ),
  },
  {
    header: "",
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <FileCardActions file={row.original} isFav={row.original.isFav} />
      </div>
    ),
  },
]
