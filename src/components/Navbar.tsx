import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import React from 'react'

const Navbar = () => {
  return (
    <div className='border-b border-gray-200 py-4 shadow-sm sticky top-0 bg-gray-50 z-50'>
      <div className="container mx-auto flex justify-between items-center">
        Hellos
        <div className="gap-3">
          <OrganizationSwitcher />
          <UserButton />
        </div>
      </div>
    </div>
  )
}

export default Navbar