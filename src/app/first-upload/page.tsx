'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, File as FileIcon, CheckCircle, StepForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useRouter } from 'next/navigation'
import { Doc } from '../../../convex/_generated/dataModel'
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
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome Back!</h1>
                    <p className="text-gray-600 mb-6">Lets see what you have in your dashboard.</p>
                    <Button
                        className='flex gap-2 items-center justify-center w-full'
                        onClick={() => router.push('/dashboard/files')}
                    >
                        Go to Dashboard
                        <StepForward className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[75dvh] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Upload Your First File</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="fileTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            File Title
                        </label>
                        <input
                            type="text"
                            id="fileTitle"
                            value={fileTitle}
                            onChange={(e) => setFileTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter a title for your file"
                            required
                        />
                    </div>

                    {files.length === 0 ? (
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-colors ${isDragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300'
                                }`}
                        >
                            <input {...getInputProps()} />
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">
                                    Drop a file here, or click to select a file
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-4">
                            <div className="p-4 border rounded-lg bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileIcon className="h-8 w-8 text-purple-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {files[0].name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {(files[0].size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(files[0])}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full font-semibold py-2 px-4 rounded"
                        disabled={files.length === 0 || !fileTitle.trim() || isUploading || uploadComplete}
                    >
                        {isUploading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Uploading...
                            </div>
                        ) : uploadComplete ? (
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Upload Complete!
                            </div>
                        ) : (
                            'Upload File'
                        )}
                    </Button>
                </form>

                {uploadComplete && uploadedFile && (
                    <div className="mt-6 text-center">
                        <div className="mb-4 text-green-600 flex items-center justify-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            <span>File uploaded successfully!</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Redirecting to dashboard in 3 seconds...
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FirstUploadPage