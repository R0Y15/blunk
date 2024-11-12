"use client";

import { CircleFadingArrowUp, Github, StepForward } from 'lucide-react';
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { SignedIn } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
import { SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

const Hero = () => {
    const router = useRouter();

    return (
        <>
            <main
                className="grid lg:grid-cols-2 place-items-center pt-16 pb-8 md:pt-12 md:pb-24">
                <div className="py-6 md:order-1 hidden md:block">
                    <Image
                        src="/hero.png"
                        alt="Astronaut in the air"
                        width={500}
                        height={500}
                        sizes="(max-width: 800px) 100vw, 620px"
                        loading="eager"
                        className='scale-x-[-1]'
                    />
                </div>
                <div>
                    <h1
                        className="font-hero font-hero-bold text-5xl lg:text-6xl xl:text-7xl lg:tracking-tight xl:tracking-tighter">
                        A File Sharing Platform
                    </h1>
                    <p className="text-lg mt-4 text-slate-600 max-w-xl">
                        Blunk is a completely open source file sharing platform, built with Next.js, Shadcn, Clerk, and TailwindCSS. Share files effortlessly, seamlessly, and securely.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 my-5">

                        <SignedIn>
                            <Button
                                className='flex gap-2 items-center justify-center p-6 border-2 border-black rounded-sm cursor-pointer group'
                                onClick={() => router.push('/dashboard/files')}
                            >
                                Go to Dashboard
                                <StepForward className="text-white w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button
                                    className='flex gap-2 items-center justify-center p-6 border-2 border-black rounded-sm cursor-pointer group'
                                >
                                    Get Started
                                    <StepForward className="text-white w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </SignInButton>
                        </SignedOut>

                        <Button
                            className='flex gap-2 items-center justify-center p-6 border-2 border-black rounded-sm cursor-pointer group'
                            variant={'outline'}
                            onClick={() => router.push('https://github.com/R0Y15/blank')}
                        >
                            <Github className="w-5 h-5 transition-transform group-hover:scale-110" />
                            <p>Github Repo</p>
                        </Button>

                    </div>
                    <Link
                        href={"/public/global"}
                    >
                        <div className='flex flex-row items-center gap-2'>
                            <span className='text-sm text-slate-600 hover:underline'>Try our Global File sharing</span>
                            <CircleFadingArrowUp className='w-5 h-5 text-slate-600 animate-pulse rotate-90' />
                        </div>
                    </Link>
                </div>
            </main>
        </>
    )
}

export default Hero