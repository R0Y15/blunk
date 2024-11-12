import { Icon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Technologies = () => {
    return (
        <>
            <div className="mt-24">
                <h2 className="text-center text-slate-500">Built with technologies</h2>
                <div className="flex gap-4 md:gap-20 items-center justify-center mt-10 flex-wrap">
                    <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
                        <Image src="/images/technologies/next.svg" alt="Next.js" width={30} height={30} className="w-[25px] h-[25px] md:w-[40px] md:h-[40px]" />
                    </a>
                    <a href="https://docs.convex.dev" target="_blank" rel="noopener noreferrer">
                        <Image src="/images/technologies/convex.svg" alt="Convex" width={40} height={40} className="w-[35px] h-[35px] md:w-[60px] md:h-[60px]" />
                    </a>
                    <a href="https://clerk.com/docs" target="_blank" rel="noopener noreferrer">
                        <Image src="/images/technologies/clerk.svg" alt="Clerk" width={30} height={30} className="w-[25px] h-[25px] md:w-[40px] md:h-[40px]" />
                    </a>
                    <a href="https://tailwindcss.com/docs" target="_blank" rel="noopener noreferrer">
                        <Image src="/images/technologies/tailwind.svg" alt="Tailwind" width={30} height={30} className="w-[25px] h-[25px] md:w-[40px] md:h-[40px]" />
                    </a>
                    <a href="https://www.radix-ui.com/themes/docs" target="_blank" rel="noopener noreferrer">
                        <Image src="/images/technologies/radix.svg" alt="Radix UI" width={30} height={30} className="w-[25px] h-[25px] md:w-[40px] md:h-[40px]" />
                    </a>
                    <a href="https://www.typescriptlang.org/docs" target="_blank" rel="noopener noreferrer">
                        <Image src="/images/technologies/typescript.svg" alt="TypeScript" width={30} height={30} className="w-[25px] h-[25px] md:w-[40px] md:h-[40px]" />
                    </a>
                </div>
            </div>
        </>
    )
}

export default Technologies