import { AiFillAudio, AiFillSound, AiOutlineAudio } from "react-icons/ai"
import { FaAudible, FaAudioDescription, FaRegFileAudio } from "react-icons/fa"
import { LiaAdobe, LiaAudible, LiaAudioDescriptionSolid, LiaEye, LiaFileAudio, LiaMusicSolid, LiaShareSquare } from "react-icons/lia"
import { RiSoundModuleFill, RiSurroundSoundFill, RiSurroundSoundLine } from "react-icons/ri"
import { TfiMusic, TfiSoundcloud } from "react-icons/tfi"
import { ModalAudio } from "../../Dialog/modal_audio"
import { useOutletContext } from "react-router-dom"
import { useModal } from "../../Dialog/ModalContext"

export const MinAudio=({titulo,descricao,img,audio})=>{
    const { openModal } = useModal();
    function OpenModal() {
        openModal("modalAudio", {
            titulo: titulo,
            audio: audio,
            src: img,
            descricao: descricao
        })
    }

    return <article className="artigo flex flex-col w-[300px] h-[360px] shadow-black/20 shadow-xl">
        <figure>
            <h2 className="text-black font-bold  rounded-t-xl text-li-nav relative p-5 px-10 z-10 border-[1px] border-solid ">{titulo}</h2>
            <div className="  flex gradient  gap-10 justify-center items-center absolute h-[170px] w-[300px] opacity-0">
                <AiFillSound onClick={OpenModal} size={30} color="white"/>
            </div>
            <img src={img} alt="" className=" cursor-pointer h-[170px] object-cover w-[400px]"/>
               
        </figure>
        <div className="bg-secondary px-10 py-5 flex gap-2 flex-col h-[100px]">
                <p>{descricao}</p>
            </div>
        <div className="flex">
            <button className="buttonRectangle artcle" onClick={OpenModal}>Escutar</button>
            <button className="buttonRectangle-white artcle">Baixar</button>
        </div>
    </article>
}