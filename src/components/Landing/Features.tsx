import { features } from '@/constants'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

const Features = () => {
    return (
        <>
            <div className="mt-16 md:mt-0">
                <h2 className="text-4xl lg:text-5xl font-bold lg:tracking-tight">
                    Everything that we provide at Blunk
                </h2>
                <p className="text-lg mt-4 text-slate-600">
                    Salient features that we provide at Blunk
                </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 mt-16 gap-6">
                {features.map((item, idx) => (
                    <Card
                        key={idx}
                        className="group transition-all duration-300 hover:shadow-lg hover:shadow-slate-200 cursor-pointer border border-border"
                    >
                        <CardContent className="flex gap-4 items-start p-6">
                            <div className="mt-1 bg-black rounded-full p-2 w-8 h-8 shrink-0 flex items-center justify-center">
                                <item.icon className="text-white w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                <p className="text-slate-500 mt-2 leading-relaxed text-sm">{item.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default Features
