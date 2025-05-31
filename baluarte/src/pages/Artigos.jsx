import { useState } from "react";
import { quemsomos } from "../assets/Assets"
import { MinActive } from "../components/cards/Actividade/min-active"
import { ListItem } from "../components/items-list/ListItem";
import { SlidesActiviy } from "../components/cards/Actividade/slides-active";
import { LiaSearchSolid } from "react-icons/lia";
import { Select } from "../components/select/Select";
import { FaCalendarDays, FaChurch, FaPeopleGroup, FaUsers } from "react-icons/fa6";
import { GridArticle } from "../components/cards/Articles/gridArticle";

export const Artigo=()=>{
    return <>
        <section className="xl:m-32 m-10 flex flex-col items-center">
            <div className="h2-title sec w-min">
                    <h1>Artigos</h1>
                </div>
            <div className="gap-10 flex pb-32 flex-wrap">
                <div className="flex items-center w-[60vw] max-w-[800px]">
                    <input type="text" placeholder="Pesquisar actividade" name="" id="" className=" w-full h-16 pl-10 rounded-lg border-solid border border-gray-950/50 outline-0"/>
                    <LiaSearchSolid className="relative -left-16" size={"2rem"}/>
                </div>
                <Select vect={["Todos Artigos","Estudo Bíblico","Devocional","Histórico","Doutrinário","Testemunho","Apologética","Profético","Teológico"]} icon={FaChurch}/>
            </div>
            <div className="flex justify-center flex-col items-center">
                <GridArticle />
            </div>
            
        </section>
               
    </>
}