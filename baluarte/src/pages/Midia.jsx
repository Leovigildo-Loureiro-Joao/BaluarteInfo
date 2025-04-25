import { useState } from "react";
import { quemsomos } from "../assets/Assets"
import { MinActive } from "../components/cards/Actividade/min-active"
import { ListItem } from "../components/items-list/ListItem";
import { SlidesActiviy } from "../components/cards/Actividade/slides-active";
import { LiaSearchSolid } from "react-icons/lia";

export const Midia=()=>{
    return <>
        <section className="m-32">
            <div className="h2-title sec">
                    <h1>Actividades</h1>
                    <span></span>
                </div>
            <div className="flex items-center pb-32">
                <input type="text" placeholder="Pesquisar actividade" name="" id="" className=" w-[400px] h-20 pl-10 rounded-lg border-solid border border-gray-950/50 outline-0"/>
                <LiaSearchSolid className="relative -left-16" size={"2rem"}/>
                <select className="text-li-nav bg-white px-10 h-20 pl-10 rounded-lg border-solid border border-gray-950/50 outline-0" content="Filtros"> 
                    <option>Organizador</option>
                    <option>Tipo de Evento</option>
                    <option>Tema</option>
                    <option>Publico alvo</option>
                </select>
            </div>
            <div className="flex justify-center flex-col items-center">
                <SlidesActiviy />
            </div>
           
        </section>
       
    </>
}