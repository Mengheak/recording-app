import Header from '@/components/Header'
import VideoCard from '@/components/VideoCard'
import { dummyCards } from '@/constants'

const Page = () => {
  return (
    <main className={"wrapper page"}>
      <Header title='All videos' subHeader='Public Library' />
      <h1 className={"font-karla"}>Welcome to LOOM clone</h1>
      <section className='video-grid'>
        {dummyCards.map(card => {
          return <VideoCard
            key={card.id}
            {...card}
          />
        })}
      </section>
    </main>
  )
}

export default Page