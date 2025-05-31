// ModalContext.jsx
import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModal = () => {
    return useContext(ModalContext);
};

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState(null);
    const [modalProps, setModalProps] = useState({});

    const openModal = (modalType, props = {}) => {
        setModal(modalType);
        setModalProps(props);
    };

    const closeModal = () => {
        
        setModal(null);
        setModalProps({});
    };

    return (
        <ModalContext.Provider value={{ modal, modalProps, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};
