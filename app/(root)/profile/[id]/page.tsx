import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';
import { dummyCards } from '@/constants';
import React from 'react'

const page = async ({ params }: ParamsWithSearch) => {
    const { id } = await params;
    return (

        <div className='wrapper page'>
            <Header subHeader='mengheak088@gmail.com' title='HeakCG | 20' userImg='/assets/images/dummy.jpg' />

            <section className='video-grid'>
                {dummyCards.map(card => {
                    return <VideoCard
                        key={card.id}
                        {...card}
                    />
                })}
            </section>
        </div>
    )
}

export default page