import { AiFillAudio, AiFillSound, AiOutlineAudio } from "react-icons/ai"
import { FaAudible, FaAudioDescription, FaRegFileAudio } from "react-icons/fa"
import { LiaAdobe, LiaAudible, LiaAudioDescriptionSolid, LiaEye, LiaFileAudio, LiaMusicSolid, LiaShareSquare } from "react-icons/lia"
import { RiSoundModuleFill, RiSurroundSoundFill, RiSurroundSoundLine } from "react-icons/ri"
import { TfiMusic, TfiSoundcloud } from "react-icons/tfi"
import { ModalAudio } from "../../Dialog/modal_audio"
import { useOutletContext } from "react-router-dom"

export const MinAudio=({titulo,descricao,img,audio})=>{
    const values=useOutletContext();
    function OpenModal() {
        values.setModal(<ModalAudio titulo={titulo} src={img} descricao={descricao} audio={audio} setModal={ values.setModal}/>)
    }

    return <article className="artigo flex flex-col w-[300px]">
        <figure>
            <h2 className="text-white  rounded-t-xl text-li-nav font-bold relative top-[45px] p-5 px-10 z-10 bg-black/70">{titulo}</h2>
            <div className="  bg-black/60 flex   gap-10 justify-center items-center absolute h-[200px] w-[300px] opacity-0">
                <AiFillSound onClick={OpenModal} size={30} color="white"/>
            </div>
            <img src={img} alt="" className="rounded-t-xl cursor-pointer h-[200px] object-cover w-[400px]"/>
        </figure>
        <div className="bg-black px-10 py-5 flex gap-2 flex-col h-[150px]">
            <p className="text-white">{descricao}</p>
        </div>
        <div className="flex">
            <button className="buttonRectangle artcle" onClick={OpenModal}>Escutar</button>
            <button className="buttonRectangle-white artcle">Baixar</button>
        </div>
    </article>
}