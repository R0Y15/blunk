"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useToast } from '@/hooks/use-toast';
import { useUser } from "@clerk/nextjs";

export function TextUploadDialog() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const createGlobalFile = useMutation(api.files.createGlobalFile);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter some text content",
      });
      return;
    }

    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: content.trim(),
      });
      const { storageId } = await result.json();
      
      const fileKey = await createGlobalFile({
        name: title.trim(),
        fileId: storageId,
        type: "text",
        isGlobal: true,
      });

      toast({
        title: "Text Shared Successfully",
        description: `File Key: ${fileKey} (valid for 10 minutes)`,
      });
      
      setIsOpen(false);
      setTitle('');
      setContent('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sharing text",
        description: "Please try again later",
      });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const plainText = e.target.value.replace(/<[^>]*>/g, '');
    setContent(plainText);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Share Text</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Text Globally</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Enter your text here..."
            value={content}
            onChange={handleContentChange}
            className="min-h-[200px]"
            required
          />
          <Button type="submit" className="w-full">
            Share
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 