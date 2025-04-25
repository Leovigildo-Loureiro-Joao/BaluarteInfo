import { artigo } from "../../assets/Assets"
import { ModalArtigo } from "./modal_artigo"
import { ModalAudio } from "./modal_audio"

export const ModalContent=()=>{
    return <>
        <section id="modal-content" className="bg-black/50 w-svw h-svh fixed z-50 flex justify-center items-center  ">
           <ModalArtigo/>
        </section>
    </>
}