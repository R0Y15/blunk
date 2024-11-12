"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Doc } from '../../convex/_generated/dataModel';
import { formatDistance } from 'date-fns';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface TextCardProps {
  file: Doc<"files"> & { isFav: boolean };
  content?: string;
}

const TextCard = ({ file, content }: TextCardProps) => {
  const { toast } = useToast();
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  const handleCopy = async () => {
    if (content) {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Text copied!",
        description: "The text has been copied to your clipboard.",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          {file.name}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[200px] overflow-y-auto">
        <p className="whitespace-pre-wrap">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2 text-xs text-gray-700 text-semibold">
          <Avatar className="w-6 h-6">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs">
          Uploaded {formatDistance(new Date(file._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TextCard;
