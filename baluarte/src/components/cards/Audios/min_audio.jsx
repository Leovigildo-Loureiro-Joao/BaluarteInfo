
import { TfiMusic, TfiSoundcloud } from "react-icons/tfi"
import { ModalAudio } from "../../Dialog/modal_audio"
import { useOutletContext } from "react-router-dom"
import { useModal } from "../../Dialog/ModalContext"
import { FaMusic, FaPlay, FaSoundcloud } from "react-icons/fa6"
import { FaPlayCircle } from "react-icons/fa"
import { activi, quemsomos, salvacao } from "../../../assets/Assets"

export const MinAudio=({titulo,descricao,img,tipo="Culto solene",audio})=>{
    const { openModal } = useModal();
    function OpenModal() {
        openModal("modalAudio", {
            titulo: titulo,
            audio: audio,
            src: img,
            descricao: descricao 
            ,tipo:tipo,
            relacionados:[
                { titulo: "Luz no Caminho", escritor: "Pr. João", tipo: "Devocional" ,"src":activi},
                { titulo: "O Verbo se fez Carne", escritor: "Ir. Maria", tipo: "Comentário","src":quemsomos },
                { titulo: "Verdade que Liberta", escritor: "Ev. Paulo", tipo: "Estudo", "src":salvacao}
            ]
        })
    }

    return  <article className="artigo flex flex-col w-full h-[360px] shadow-black/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30">
                <figure className="relative">
                    <div className="flex rounded-t-xl justify-between relative p-5 px-10 z-10 border-[1px] border-solid">
                    <h2 className="text-black font-bold  text-li-nav relative">{titulo}</h2>
                    <h2 className="text-primary  text-li-nav  ">{tipo}</h2>
                    </div>
                    <div className="  flex gradient black  gap-10 justify-center items-center absolute h-[170px] w-full  opacity-0">
                        <FaPlay onClick={OpenModal} size={30} color="white"/>
                    </div>
                    <figure>
                    <img src={img} alt="" className=" cursor-pointer h-[170px] object-cover w-full"/>
                    </figure>
                   
                       
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