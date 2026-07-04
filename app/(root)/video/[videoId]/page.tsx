import React from 'react'

const page = async ({ params }: ParamsWithSearch) => {
    const { videoId } = await params
    return (
        <main className='main-page'>
            VIDEO DETAILS PAGE {videoId}
        </main>
    )
}

export default page