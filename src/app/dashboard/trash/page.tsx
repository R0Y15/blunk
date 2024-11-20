import { BrowserContent } from '@/components'
import React from 'react'

const page = () => {
    return (
        <div>
            <BrowserContent title={"Trash"} deleteOnly />
        </div>
    )
}

export default page