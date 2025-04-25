import { video } from "../../assets/Assets"
import { ModalVideo } from "./modal_video"
import { ModalAudio } from "./modal_audio"

export const ModalContent=({modal=null})=>{
    return <>
        <section id="modal-content" className={"bg-black/50 w-svw h-svh fixed z-50 flex justify-center items-center  "+(modal==null?"":"show")}>
            {modal}
        </section>
    </>
}