import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className="h-14 bg-gray-100 flex items-center relative bottom-0 left-0 right-0">
      <div className="container mx-auto flex justify-between items-center">
        <div>FileDrive</div>

        <Link className="text-blue-900 hover:text-blue-500" href="/privacy">
          Privacy Policy
        </Link>
        <Link
          className="text-blue-900 hover:text-blue-500"
          href="/terms-of-service"
        >
          Terms of Service
        </Link>
        <Link className="text-blue-900 hover:text-blue-500" href="/about">
          About
        </Link>
      </div>
    </div>
  )
}

export default Footer