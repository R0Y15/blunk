"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useToast } from '@/hooks/use-toast';
import { useUser } from "@clerk/nextjs";
import { Loader2, Type } from 'lucide-react';

export function TextUploadDialog() {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createGlobalFile = useMutation(api.files.createGlobalFile);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { toast } = useToast();

  if (!isSignedIn) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({ variant: "destructive", title: "Empty content", description: "Please enter some text." });
      return;
    }

    try {
      setIsSubmitting(true);
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: content.trim(),
      });
      const { storageId } = await result.json();

      const fileKey = await createGlobalFile({
        name: title.trim() || 'Untitled Text',
        fileId: storageId,
        type: "text",
        isGlobal: true,
      });

      toast({
        title: "Text Shared",
        description: `Key: ${fileKey} · Valid for 10 minutes`,
      });

      setIsOpen(false);
      setTitle('');
      setContent('');
    } catch {
      toast({ variant: "destructive", title: "Share failed", description: "Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Type className="w-4 h-4" />
          Share Text
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Text Globally</DialogTitle>
          <DialogDescription>
            Share a snippet of text. Recipients can copy it using a 10-minute key.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="text-title">Title</Label>
            <Input
              id="text-title"
              placeholder="e.g. API Key, Meeting Notes..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="text-content">Content</Label>
            <Textarea
              id="text-content"
              placeholder="Paste or type your text here..."
              value={content}
              onChange={(e) => setContent(e.target.value.replace(/<[^>]*>/g, ''))}
              className="min-h-[140px] resize-none font-mono text-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-24 gap-2">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sharing</>
              ) : (
                'Share'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
