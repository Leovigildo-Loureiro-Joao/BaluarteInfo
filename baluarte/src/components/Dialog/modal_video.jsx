import { RxExit, RxMinus, RxPlay, RxPlus } from "react-icons/rx"
import { music } from "../../assets/Assets"
import { ListItem } from "../items-list/ListItem"
import { useState } from "react"


const YouTubeVideo = ({ videoId }) => {
    const videoUrl = `https://www.youtube.com/embed/${videoId}`;
    
    return (
      <div className="video-container mx-10 rounded-xl">
        <iframe
          width="500"
          height="315"
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
  
  export default YouTubeVideo;

export const ModalVideo=({titulo,descricao,video,closeModal})=>{

    return <dialog className="w-[800px] h-[400px] min-h-[400px] bg-white rounded-xl flex flex-col static">
        <div className="flex justify-between p-10 pb-5"><h2 className="text-h2-title font-bold text-primary">{titulo}</h2><RxPlus onClick={closeModal} className=" text-4xl transition-all duration-300 rotate-45 hover:text-primary hover:shadow-inner"/></div>
        <div className=" flex gap-5">
            <YouTubeVideo videoId={video} />
            <div className="max-w-[200px] max-h-[240px] overflow-x-hidden overflow-y-auto">
                <h2 className="text-h2-title text-primary font-semibold mb-5">Descricao</h2>
                <p>
                    {descricao}
                </p>
            </div>
        </div>
    </dialog>
}