import { Check } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const PricingCard = ({ plan }: { plan: any }) => {
    const isPopular = plan.popular === true

    return (
        <Card className={`relative flex flex-col w-full ${isPopular ? 'border-2 border-black shadow-lg' : 'border border-border'}`}>
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-black text-white px-3 py-0.5 text-xs font-semibold">
                        Most Popular
                    </Badge>
                </div>
            )}

            <CardHeader className="text-center pb-4">
                <CardDescription className="text-base font-medium">{plan.name}</CardDescription>
                <CardTitle className="text-4xl font-bold mt-2">
                    {plan.price && typeof plan.price === "object"
                        ? plan.price.monthly
                        : plan.price}
                </CardTitle>
                {plan.price && typeof plan.price === "object" && (
                    <p className="text-sm text-muted-foreground mt-1">per month</p>
                )}
            </CardHeader>

            <Separator />

            <CardContent className="flex-1 pt-6">
                <ul className="space-y-3">
                    {plan.features.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-800">
                            <Check className="w-4 h-4 mt-0.5 shrink-0 text-green-600" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className="pt-4">
                <Button
                    asChild
                    className="w-full h-12"
                    variant={isPopular ? "default" : "outline"}
                >
                    <Link href={plan.button.link || "#"}>
                        {plan.button.text || "Get Started"}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default PricingCard
