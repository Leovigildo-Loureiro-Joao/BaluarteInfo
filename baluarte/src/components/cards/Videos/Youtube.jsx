export const YouTubeVideo = ({ videoId,width=500,height=315 }) => {
    const videoUrl = `https://www.youtube.com/embed/${videoId}`;
    
    return (
      <div className="video-container mx-10 rounded-xl">
        <iframe
          width={width}
          height={height}
          src={videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl"
        ></iframe>
      </div>
    );
  };