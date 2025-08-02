import { FaArrowLeft } from "react-icons/fa6"

export const ModalSelect = ({ data,setOpen,closeModal }) => {
    setOpen(true)
    return (
      <div className="bg-white overflow-hidden w-screen h-screen bottom-0 fixed max-h-[90vh] rounded-xl flex flex-col gap-5 p-10 overflow-y-auto">
        {/* Cabeçalho */}
        <div className="ml-10 flex gap-10 items-center text-text-pargh">
            <FaArrowLeft onClick={closeModal}/><h1>Filtros</h1>
        </div>
        {/* Dados */}
        <div className="overflow-y-auto overflow-x-hidden h-[90%]">
            {data}
        </div>
    </div>
    )
}