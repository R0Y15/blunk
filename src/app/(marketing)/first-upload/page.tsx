'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, File as FileIcon, CheckCircle, StepForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useRouter } from 'next/navigation'
import { Doc } from '../../../../convex/_generated/dataModel'
import { FileCard } from '@/components'

const FirstUploadPage = () => {
    const [files, setFiles] = useState<File[]>([])
    const [fileTitle, setFileTitle] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [uploadComplete, setUploadComplete] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<Doc<"files"> & { isFav: boolean } | null>(null)
    const router = useRouter()
    const organization = useOrganization()
    const user = useUser()

    let orgId: string | undefined = undefined
    if (organization.isLoaded && user.user?.id) {
        orgId = organization.organization?.id ?? user.user?.id
    }

    const existingFiles = useQuery(api.files.getFile,
        orgId ? { orgId, query: '', type: undefined } : 'skip'
    )

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prevFiles => {
            const newFile = acceptedFiles[0]
            return newFile ? [newFile] : prevFiles
        })
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const removeFile = (fileToRemove: File) => {
        setFiles(files.filter(file => file !== fileToRemove))
        setFileTitle('')
    }

    const generateUploadUrl = useMutation(api.files.generateUploadUrl)
    const createFile = useMutation(api.files.createFile)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!orgId || files.length === 0) return

        try {
            setIsUploading(true)

            const file = files[0]
            const fileType = file.type

            const postUrl = await generateUploadUrl()

            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": fileType },
                body: file,
            })

            const { storageId } = await result.json()

            const types = {
                "image/png": "image",
                "image/jpg": "image",
                "image/jpeg": "image",
                "application/pdf": "pdf",
                "text/csv": "csv",
                "text/xlsx": "csv",
            } as Record<string, Doc<"files">["type"]>

            await createFile({
                name: fileTitle,
                fileId: storageId,
                orgId,
                type: types[fileType] || "pdf"
            })

            setUploadComplete(true)

            setTimeout(() => {
                setFiles([])
                setFileTitle('')
                setUploadComplete(false)
                router.push('/dashboard/files')
            }, 3000)

        } catch (error) {
            console.error('Upload failed:', error)
        } finally {
            setIsUploading(false)
        }
    }

    if (existingFiles && existingFiles.length > 0) {
        return (
            <div className="min-h-[75dvh] flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
                        <CardDescription>Lets see what you have in your dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="flex gap-2 items-center justify-center w-full"
                            onClick={() => router.push('/dashboard/files')}
                        >
                            Go to Dashboard
                            <StepForward className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-[75dvh] flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Upload Your First File</CardTitle>
                    <CardDescription>Get started by uploading a file to your dashboard.</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fileTitle">File Title</Label>
                            <Input
                                type="text"
                                id="fileTitle"
                                value={fileTitle}
                                onChange={(e) => setFileTitle(e.target.value)}
                                placeholder="Enter a title for your file"
                                required
                            />
                        </div>

                        {files.length === 0 ? (
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
                                    isDragActive
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                }`}
                            >
                                <input {...getInputProps()} />
                                <div className="text-center">
                                    <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Drop a file here, or click to select
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 border rounded-lg bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileIcon className="h-8 w-8 text-primary" />
                                        <div>
                                            <p className="text-sm font-medium">{files[0].name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(files[0].size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFile(files[0])}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={files.length === 0 || !fileTitle.trim() || isUploading || uploadComplete}
                        >
                            {isUploading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Uploading...
                                </span>
                            ) : uploadComplete ? (
                                <span className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Upload Complete!
                                </span>
                            ) : (
                                'Upload File'
                            )}
                        </Button>
                    </form>

                    {uploadComplete && (
                        <div className="mt-6 text-center space-y-2">
                            <div className="text-green-600 flex items-center justify-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">File uploaded successfully!</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Redirecting to dashboard in 3 seconds...
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default FirstUploadPage
