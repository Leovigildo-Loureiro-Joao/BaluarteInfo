import { LiaSearchSolid } from "react-icons/lia";
import { useModal } from "../../Dialog/ModalContext";
import { FaChevronDown } from "react-icons/fa6";
import { Filtros } from "../../../pages/Actividade";

export const SearchActividade=({title})=>{
    const { openModal } = useModal();
    function OpenModal() {
        openModal("modalSelect", {
            data: <Filtros open={true} modal={true}/>,
            setOpen:setOpen
        })
    }
    
    return  <>
    <div className="h2-title sec">
    <h1>{title}</h1>
</div>
<div className="gap-10 flex flex-col lg:pb-32 pb-16">
    <label htmlFor="search" className="sr-only">Pesquisar atividade</label>
    <div className="relative lg:w-auto w-[75vw] flex items-center">
        <input 
            type="text" 
            id="search" 
        placeholder="Pesquisar atividade" 
        className="w-full h-16 pl-14 pr-5 rounded-lg border border-gray-400 outline-none text-base"
        />
        <LiaSearchSolid className="absolute left-4 text-gray-600" size="1.5rem" />
        <button onClick={() => { OpenModal()}}  className="w-1/3 ml-10 flex lg:hidden md:flex sm:flex items-center justify-between border-gray-400 border p-4 rounded-lg  bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">Filtros <FaChevronDown /></button>
    </div>
    <Filtros/>
</div></>
}