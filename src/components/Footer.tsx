import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="max-w-screen-xl mx-auto px-5 my-8">
      <Separator className="mb-8" />
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm text-muted-foreground">
          Copyright &copy; {new Date().getFullYear()} Blunk. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground">
          Made by{' '}
          <Link
            href="https://me-roy.vercel.app"
            target="_blank"
            rel="noopener"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Roy
          </Link>
        </p>
      </div>
    </footer>
  )
}

export default Footer
