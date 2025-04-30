// ModalManager.jsx
import React from "react";
import { useModal } from "./ModalContext";
import { ModalVideo } from "./modal_video";
import { ModalAudio } from "./modal_audio";
import { ModalComentar } from "./modal_comentar";

const modals = {
    modalAudio: ModalAudio,
    modalVideo: ModalVideo,
    modalComentar: ModalComentar,
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
