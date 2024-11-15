import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'

const Cta = () => {
    return (
        <>
            <div className="bg-black p-8 md:px-20 md:py-20 mt-20 mx-auto max-w-5xl rounded-lg flex flex-col items-center text-center">
                <h2 className="text-white text-4xl md:text-6xl tracking-tight">
                    Have any Doubts?
                </h2>
                <p className="text-slate-400 mt-4 text-lg md:text-xl">
                    Feel free to contact us.
                </p>
                <div className="flex mt-6">
                    <Button asChild variant="secondary" size="lg" className="font-medium">
                        <Link href="/contact">Contact Us</Link>
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Cta;
