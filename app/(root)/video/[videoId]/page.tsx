import { redirect } from "next/navigation";

import { getVideoById } from "@/lib/actions/video";
import VideoPlayer from "@/components/VideoPlayer";
import VideoDetailHeader from "@/components/VideoDetailHeader";

const page = async ({ params }: Params) => {
  const {videoId} = await params;

    const {video, user} = await getVideoById(videoId)
    if(!video) redirect('/404')
  return (
    <main className="wrapper page">
      <VideoDetailHeader
        title={video.title}
        createdAt={video.createdAt}
        userImg={user?.image}
        username={user?.name}
        videoId={video.videoId}
        ownerId={video.userId}
        visibility={video.visibility}
        thumbnailUrl={video.thumbnailUrl}
      />

      <section className="video-details">
        <div className="content">
          <VideoPlayer videoId={video.videoId} />
        </div>

        {/* <VideoInfo
          title={video.title}
          createdAt={video.createdAt}
          description={video.description}
          videoId={videoId}
          videoUrl={video.videoUrl}
        /> */}
      </section>
    </main>
  );
};

export default page;