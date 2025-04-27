import { video } from "../../assets/Assets"
import { ModalVideo } from "./modal_video"
import { ModalAudio } from "./modal_audio"
import { useEffect, useRef, useState } from "react";

export const ModalContent=({modal=null})=>{
    const dialogRef = useRef(null);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (modal !== null && dialogRef.current) {
            dialogRef.current.showModal();
        } else if (dialogRef.current && modal === null) {
            dialogRef.current.close();
        }
    }, [modal]);

    const handleClose = () => {
        // Animação de fechamento
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            if (dialogRef.current) {
                dialogRef.current.close();
            }
        }, 300); // Tempo igual à duração do fade-out
    };

    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.addEventListener('close', () => {
                setIsClosing(false);
            });
        }
    }, []);

    return <>
        <section id="modal-content" className={"bg-black/50 w-svw h-svh fixed z-50 flex justify-center items-center "+(modal==null?"":"show")}>
            {modal()}
        </section>
    </>
}