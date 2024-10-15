import { BrowserContent } from '@/components'
import React from 'react'

const page = () => {
  return (
    <div>
      <BrowserContent title={"Favourites"} favouritesOnly />
    </div>
  )
}

export default page