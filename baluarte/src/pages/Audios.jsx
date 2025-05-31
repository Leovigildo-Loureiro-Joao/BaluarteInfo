import { useState } from "react";
import { quemsomos } from "../assets/Assets"
import { MinActive } from "../components/cards/Actividade/min-active"
import { ListItem } from "../components/items-list/ListItem";
import { SlidesActiviy } from "../components/cards/Actividade/slides-active";
import { LiaSearchSolid } from "react-icons/lia";
import { GridAudios } from "../components/cards/Audios/GridAudios";
import { Select } from "../components/select/Select";
import { FaMusic } from "react-icons/fa6";

export const Audios=()=>{

    return <>
        <section className="xl:m-32 m-10 flex flex-col items-center">
            <div className="h2-title sec w-min">
                <h1>Audios</h1>
            </div>
        <div className="gap-10 flex pb-32 flex-wrap">
            <div className="flex items-center w-[60vw] max-w-[730px]">
                <input type="text" placeholder="Pesquisar audios" name="" id="" className=" w-full h-16 pl-10 rounded-lg border-solid border border-gray-950/50 outline-0"/>
                <LiaSearchSolid className="relative -left-16" size={"2rem"}/>
            </div>
             <Select vect={["Todos Audios","Louvores","Mensagens (Pregações em áudio)","Orações e Intercessões","Testemunhos em áudio","Devocionais","Apologética","Profético","Teológico"]} icon={FaMusic}/>
        </div>
        <div className="flex justify-center flex-col items-center">
            <GridAudios />
        </div>
           
        </section>
       
    </>
}