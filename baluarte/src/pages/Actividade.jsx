
import { SlidesActiviy } from "../components/cards/Actividade/slides-active";
import { LiaSearchSolid } from "react-icons/lia";
import { Select } from "../components/select/Select";
import { RxPerson } from "react-icons/rx";
import { FaCalendarDays, FaChevronDown, FaChurch, FaPeopleGroup, FaUsers } from "react-icons/fa6";
import { useState } from "react";
import { useModal } from "../components/Dialog/ModalContext";
import { SearchActividade } from "../components/cards/Actividade/SeachActividade";

export const Actividade=()=>{
    return <>
        <section className="xl:m-32 m-10 flex flex-col items-center">
           <SearchActividade title={"Actividades"}/>
            <div className="flex justify-center flex-col items-center">
                <SlidesActiviy />
            </div>
           
        </section>
       
    </>
}

export const Filtros=({open=false,modal=false})=>{
    return  <div className={" "+(open?" lg:flex z-50 md:flex flex-col bg-white w-screen":" hidden lg:flex gap-5 " )}>
    <Select modal={modal} title={"Organizador"} vect={["Todos Organizadores","Grupo de Jovens","Pastoral","Coral","Equipa de Liderança"]} icon={FaPeopleGroup} />
    <Select modal={modal} title={"Eventos"} vect={["Todos Tipos de Evento","Retiro","Palestra","Workshop","Louvor"]} icon={FaChurch} />
    <Select modal={modal} title={"Publico alvo"} vect={["Todos Públicos Alvos","Jovens","Adultos","Crianças","Famílias","Idosos"]} icon={FaUsers} />
    <Select modal={modal} title={"Tipo de Actividade"} vect={["Qualquer Atividade","Realizadas","Pendentes"]} icon={FaCalendarDays} />
</div>
}

