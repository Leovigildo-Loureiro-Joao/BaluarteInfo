
import { FaPlay } from "react-icons/fa"
import { TfiControlPlay, TfiMusic } from "react-icons/tfi"
import { useModal } from "../../Dialog/ModalContext";

export const MinVideo=({titulo,img,video,descricao})=>{
    const { openModal } = useModal();
    function OpenModal() {
        openModal("modalVideo", {
            titulo: titulo,
            video: "rtlOE2WV8NQ",
            descricao: descricao
        })
    }
    return <article className="artigo h-[280px] flex flex-col w-[300px] shadow-black/20 shadow-md rounded-xl">
        <figure>
            <h2 className="text-black rounded-t-xl text-li-nav font-bold relative p-5 px-10 z-10">{titulo}</h2>
            <div className="  gradient flex gap-10 justify-center items-center absolute h-[200px] w-[300px] opacity-0">
                <FaPlay  size={30} color="white" onClick={OpenModal}/>
            </div>
            <img src={img} alt="" className=" cursor-pointer h-[200px] object-cover w-[400px]"/>
        </figure>
        <div className="flex">
            <button className="buttonRectangle artcle" onClick={OpenModal}>Reproduzir</button>
            <button className="buttonRectangle-white artcle">Baixar</button>
        </div>
    </article>
}