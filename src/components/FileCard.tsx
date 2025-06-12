"use client";

import React, { ReactNode } from 'react'
import { Doc } from '../../convex/_generated/dataModel'
import { formatDistance } from 'date-fns'
import {
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  FileIcon,
} from 'lucide-react'
import { api } from '../../convex/_generated/api';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import FileCardActions from './FileActions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const typeConfig: Record<
  Doc<'files'>['type'],
  { icon: ReactNode; label: string; color: string; bg: string }
> = {
  image: {
    icon: <ImageIcon className="w-4 h-4" />,
    label: 'Image',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  pdf: {
    icon: <FileTextIcon className="w-4 h-4" />,
    label: 'PDF',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  csv: {
    icon: <GanttChartIcon className="w-4 h-4" />,
    label: 'CSV',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  text: {
    icon: <FileTextIcon className="w-4 h-4" />,
    label: 'Text',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
};

const FileCard = ({
  file,
  hideDropdown,
}: {
  file: Doc<'files'> & { isFav: boolean; url?: string | null };
  hideDropdown?: boolean;
}) => {
  const userProfile = useQuery(api.users.getUserProfile, { userId: file.userId });
  const config = typeConfig[file.type] ?? {
    icon: <FileIcon className="w-4 h-4" />,
    label: file.type,
    color: 'text-zinc-600',
    bg: 'bg-zinc-50',
  };

  return (
    <div className="group relative rounded-xl border bg-white hover:shadow-md hover:border-zinc-200 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Preview area */}
      <div className={cn('flex items-center justify-center h-40 relative', config.bg)}>
        {file.type === 'image' && file.url ? (
          <Image
            src={file.url}
            alt={file.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : file.type === 'text' ? (
          <div className="flex flex-col items-center gap-2 px-4">
            <div className={cn('p-3 rounded-full', config.bg)}>
              <span className={config.color}>{config.icon}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center line-clamp-3 leading-relaxed">
              {file.content ?? 'Text file'}
            </p>
          </div>
        ) : (
          <div className={cn('p-4 rounded-full', config.bg)}>
            <span className={cn('scale-150 inline-flex', config.color)}>{config.icon}</span>
          </div>
        )}

        {/* Favourite indicator */}
        {file.isFav && (
          <div className="absolute top-2 left-2">
            <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow-sm">
              <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
        )}

        {/* Actions - top right */}
        {!hideDropdown && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <FileCardActions isFav={file.isFav} file={file} />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight line-clamp-2 flex-1">{file.name}</p>
          <Badge
            variant="secondary"
            className={cn('shrink-0 text-[10px] font-semibold px-1.5 py-0.5', config.color, config.bg, 'border-0')}
          >
            {config.label}
          </Badge>
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-1.5">
            <Avatar className="w-5 h-5">
              <AvatarImage src={userProfile?.image} />
              <AvatarFallback className="text-[9px]">
                {userProfile?.name?.charAt(0) ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate max-w-[80px]">
              {userProfile?.name ?? 'Unknown'}
            </span>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatDistance(new Date(file._creationTime), new Date(), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
