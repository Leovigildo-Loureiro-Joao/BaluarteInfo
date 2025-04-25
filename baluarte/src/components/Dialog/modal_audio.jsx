import { RxExit, RxMinus, RxPlay, RxPlus } from "react-icons/rx"
import { music } from "../../assets/Assets"
import { ListItem } from "../items-list/ListItem"
import { useState } from "react"

export const ModalAudio=({titulo,audio=music,src,descricao})=>{

    const [select,setSelect]=useState(0)

    return <dialog className="w-[400px] h-[350px] min-h-[350px] bg-white rounded-xl flex flex-col static">
        <div className="flex justify-between p-10 pb-5"><h2 className="text-h2-title font-bold text-primary">{titulo}</h2><RxPlus className=" text-4xl transition-all duration-300 rotate-45 hover:text-primary hover:shadow-inner"/></div>
        <div className="min-w-fit flex flex-col items-center justify-center gap-5">
            <ul className="flex w-1/2 justify-around tema min">
                <ListItem text={"Imagem"} classe={select==0?"selected":""} setValue={setSelect} value={0} />
                <ListItem text={"Descricao"} classe={select==1?"selected":""} setValue={setSelect} value={1} />
            </ul>
            <div className="overflow-hidden w-[200px]">
                <div className="flex gap-[30px] w-[430px]" style={{
                    transform: `translateX(-${select * 230}px)`,
                    transition: "transform 0.5s ease-in-out"
                }}>
                     <figure className="w-[200px] px-[15px] h-[160px] max-w-[200px] " >
                        <img src={src} alt="" className="object-cover rounded-full object-center h-[160px] w-[160px] max-w-[160px]"/>
                    </figure>
                    <div className="max-w-[200px] max-h-[160px] overflow-x-hidden overflow-y-auto">
                        <p className="text-center">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. In ipsa veniam excepturi est quisquam suscipit aliquid aut vero. Architecto, error ea laudantium quod exercitationem distinctio quasi ratione reprehenderit. Tempora, rerum.
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. In ipsa veniam excepturi est quisquam suscipit aliquid aut vero. Architecto, error ea laudantium quod exercitationem distinctio quasi ratione reprehenderit. Tempora, rerum.
                        </p>
                    </div>
                   
                </div>
            </div>
            <audio src={audio} controls className="w-3/4 bg-transparent"></audio>
        </div>
    </dialog>
}