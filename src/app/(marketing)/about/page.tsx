import React from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const page = () => {
    return (
        <div className="font-hero max-w-screen-xl mx-auto px-4 sm:px-5 grid place-items-center min-h-[70dvh]">
            <div className="flex flex-col mx-auto justify-center items-center md:w-[70%] w-full">
                <div className="text-center space-y-2 sm:space-y-3 my-8">
                    <h1 className="font-hero-bold text-4xl sm:text-6xl">About</h1>
                    <p className="text-lg sm:text-lg text-muted-foreground">Blunk.</p>
                </div>

                <div>
                    <p className="text-lg sm:text-lg text-muted-foreground text-center">
                        Blunk is a file sharing platform that allows you to share files cross-platform. But{" "}
                        <HoverCard>
                            <HoverCardTrigger className="cursor-help underline decoration-dotted text-blue-500">
                                why Blunk?
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64">
                                <div className="flex justify-center items-center space-x-2">
                                    <span>Coz its fun!</span>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page