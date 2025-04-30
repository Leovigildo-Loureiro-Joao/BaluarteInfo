
import { FaPlay } from "react-icons/fa"
import { TfiControlPlay, TfiMusic } from "react-icons/tfi"

export const MinVideo=({titulo,img})=>{
    return <article className="artigo flex flex-col w-[300px]">
        <figure>
            <h2 className="text-white rounded-t-xl text-li-nav font-bold relative p-5 px-10 z-10">{titulo}</h2>
            <div className="  gradient flex gap-10 justify-center items-center absolute h-[200px] w-[300px] opacity-0">
                <FaPlay  size={30} color="white"/>
            </div>
            <img src={img} alt="" className=" cursor-pointer h-[200px] object-cover w-[400px]"/>
        </figure>
        <div className="flex">
            <button className="buttonRectangle artcle">Reproduzir</button>
            <button className="buttonRectangle-white artcle">Baixar</button>
        </div>
    </article>
}