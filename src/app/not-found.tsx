import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className="font-hero max-w-screen-xl mx-auto px-4 sm:px-5 grid place-items-center min-h-[70dvh]">
      <div className="flex flex-col mx-auto justify-center items-center text-center gap-6">
        <div className="space-y-3">
          <h1 className="font-hero-bold text-6xl sm:text-8xl">404</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">Page Not Found</p>
        </div>

        <Separator className="w-24" />

        <p className="text-base text-center text-muted-foreground max-w-md">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <Button asChild size="lg" className="px-8">
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
