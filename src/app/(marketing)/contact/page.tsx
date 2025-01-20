import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

const Page = () => {
    return (
        <div className="font-hero max-w-screen-xl mx-auto px-4 sm:px-5 grid place-items-center min-h-[70dvh]">
            <div className="flex flex-col mx-auto justify-center items-center md:w-[70%] w-full">
                <div className="text-center space-y-2 sm:space-y-3 my-8">
                    <h1 className="font-hero-bold text-4xl sm:text-6xl">Contact</h1>
                    <p className="text-lg sm:text-lg text-muted-foreground">We are here to help.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-8 md:mt-12 w-full">
                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <h2 className="text-2xl sm:text-2xl font-medium mb-3 sm:mb-4">Contact Blunk</h2>
                            <p className="text-lg sm:text-lg text-muted-foreground">
                                Have something to say? We are here to help. Fill up the form or send email or call phone.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <p>Jamshedpur, Jharkhand, India</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <a href="mailto:hello@astroshipstarter.com" className="hover:underline">
                                    blunk@hotmail.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <a href="tel:+19874587899" className="hover:underline">
                                    +91 (987) 4587 899
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Input
                            className="w-full h-14"
                            placeholder="Full Name"
                            type="text"
                        />
                        <Input
                            className="w-full h-14"
                            placeholder="Email Address"
                            type="email"
                        />
                        <Textarea
                            className="min-h-[150px] w-full"
                            placeholder="Your Message"
                        />
                        <Button className="w-full h-14 bg-black text-white hover:bg-black/90">
                            Send Message
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page