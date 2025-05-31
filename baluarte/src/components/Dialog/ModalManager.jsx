// ModalManager.jsx
import React from "react";
import { useModal } from "./ModalContext";
import { ModalVideo } from "./modal_video";
import { ModalAudio } from "./modal_audio";
import { ModalComentar } from "./modal_comentar";
import { ModalActividade } from "./modal_actividade";
import ModalArtigo from "./modal_artigos";
import { ModalPerfil } from "./modal_perfil";
import { ModalPassword } from "./modal_password";
import { ModalSelect } from "./modalSelects";


const modals = {
    modalAudio: ModalAudio,
    modalVideo: ModalVideo,
    modalArtigo: ModalArtigo,
    modalActividade: ModalActividade,
    modalPerfil: ModalPerfil,
    modalComentar: ModalComentar,
    modalSelect: ModalSelect,
    modalPassword:ModalPassword
};

export const ModalManager = () => {
    const { modal, modalProps, closeModal } = useModal();

    if (!modal) return null;

    const ModalComponent = modals[modal];
    return (
        <dialog open className="w-full h-full fixed top-0 left-0 flex justify-center items-center bg-black/50 z-50">
            <ModalComponent {...modalProps} closeModal={closeModal} />
        </dialog>
    );
};
