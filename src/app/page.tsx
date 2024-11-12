import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Icon } from '@radix-ui/react-select';
import Hero from '@/components/Landing/Hero';
import { Cta, Features, Technologies } from '@/components/Landing';

const page = () => {
  return (
    <div className='max-w-screen-xl mx-auto px-5 font-hero font-hero-light'>
      <Hero />
      <Features />
      <Technologies />
      <Cta />
    </div>
  )
}

export default page