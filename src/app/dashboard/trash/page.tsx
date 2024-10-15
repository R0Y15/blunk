import { BrowserContent } from '@/components'
import React from 'react'

const page = () => {
    return (
        <div>
            <BrowserContent title={"All Files"} deleteOnly />
        </div>
    )
}

export default page