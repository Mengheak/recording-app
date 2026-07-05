import { cn, createIframeLink } from '@/lib/utils'
import React from 'react'

const VideoPlayer = ({ videoId, className }: VideoPlayerProps) => {
    return (
        <div className={cn('video-player', className)}>
        <iframe
            src={createIframeLink(videoId)}
            loading='lazy'
            title='Video player'
            style={{}}
            allowFullScreen
            allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture'
        />
        </div>
    )
}

export default VideoPlayer