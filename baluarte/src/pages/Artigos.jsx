import { useState } from "react";
import { quemsomos } from "../assets/Assets"
import { MinActive } from "../components/cards/Actividade/min-active"
import { ListItem } from "../components/items-list/ListItem";
import { SlidesActiviy } from "../components/cards/Actividade/slides-active";
import { LiaSearchSolid } from "react-icons/lia";
import { Select } from "../components/select/Select";
import { FaCalendarDays, FaChurch, FaPeopleGroup, FaUsers } from "react-icons/fa6";

export const Artigo=()=>{
    return <>
        <section className="m-32 flex flex-col items-center">
            <div className="h2-title sec">
                    <h1>Artigos</h1>
                </div>
            <div className="gap-10 flex flex-col pb-32 ">
                <div className="flex items-center">
                    <input type="text" placeholder="Pesquisar actividade" name="" id="" className=" w-full h-16 pl-10 rounded-lg border-solid border border-gray-950/50 outline-0"/>
                    <LiaSearchSolid className="relative -left-16" size={"2rem"}/>
                </div>
                <div className="gap-10 flex">
                <Select vect={["Todos Tipos de Evento","Retiro","Palestra","Workshop","Louvor"]} icon={FaChurch}/>
                </div>
            </div>
            <div className="flex justify-center flex-col items-center">
                <SlidesActiviy />
            </div>
            
        </section>
               
    </>
}