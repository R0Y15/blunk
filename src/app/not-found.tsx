import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className="font-hero max-w-screen-xl mx-auto px-4 sm:px-5 grid place-items-center min-h-[70dvh]">
      <div className="flex flex-col mx-auto justify-center items-center md:w-[70%] w-full">
        <div className="text-center space-y-2 sm:space-y-3 my-8">
          <h1 className="font-hero-bold text-6xl sm:text-8xl">404</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">Page Not Found</p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <p className="text-lg text-center text-muted-foreground max-w-md">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link href="/">
            <Button className="px-8">
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
