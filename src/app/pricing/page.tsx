import PricingCard from '@/components/builders/PricingCard'
import { pricing } from '@/constants'
import React from 'react'

const page = () => {
    return (
        <div className="font-hero max-w-screen-xl mx-auto px-4 sm:px-5 grid place-items-center min-h-[70dvh] mt-14">
            <div className="text-center space-y-2 sm:space-y-3 mb-4">
                <h1 className="font-hero-bold text-4xl sm:text-6xl">Pricing</h1>
                <p className="text-lg sm:text-lg text-muted-foreground">Simple & Predictable pricing. No Surprises.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 mx-auto max-w-screen-lg mt-12">
                {pricing.map((item) => <PricingCard plan={item} />)}
            </div>
        </div>
    )
}

export default page