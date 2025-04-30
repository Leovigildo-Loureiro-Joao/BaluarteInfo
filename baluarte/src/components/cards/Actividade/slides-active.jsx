import { useState } from "react";
import { activi, quemsomos } from "../../../assets/Assets";
import { ListItem } from "../../items-list/ListItem";
import { MinActive } from "./min-active";
import { ActiviComplete } from "./activeComplete";
import { useParams } from "react-router-dom";

export const SlidesActiviy = ({data}) => {
    const [select,setSelect]=useState(1);
    const id=useParams("id").id
    const complete={
        descricao:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure est adipisci consequuntur ipsam rerum, saepe id ratione molestiae architecto velit sit tempore debitis tempora vitae laudantium praesentium earum pariatur aliquid.",
        tema:"Envangelho",
        titulo:"Nao perca a esperanca",
        tipoEvento:"Envagelismo",
        publicoAlvo:"Todos",
        Organizador:"Leovigildo",
        dataEvento:"2025-12-02T02:00:00",
        contactos:"955383237",
        img:activi
    }
    const Box=()=>{
        return  
    }
    const [selectData,setData]=useState();
    return <> 
        <nav className="flex w-[-webkit-fill-available] justify-center">
            <ul className="flex justify-around tema w-[70vw]">
                <ListItem text={location.pathname.includes("Perfil")?"Actividades participadas":"Anual"} classe={select==1?"selected":""} setValue={setSelect} value={1} />
                <ListItem text={location.pathname.includes("Perfil")?"Actividades pendentes":"Mensal"} classe={select==0?"selected":""} setValue={setSelect} value={0}/>
                <ListItem text={location.pathname.includes("Perfil")?"Actividades ignoradas":"Projecto"} classe={select==-1?"selected":""} setValue={setSelect} value={-1}/>        
            </ul>
        </nav>
       
            {id==undefined?<div >
        <div id="total"  className=" w-[70vw] overflow-hidden flex justify-center" >
            <div className="m-10 flex gap-[100px]"  style={{
                    transform: `translateX(${select * 1000}px)`,
                    transition: "transform 0.5s ease-in-out"
                }}>
                <div className="grid grid-cols-3 gap-10 w-[900px] min-w-[900px]">
                    <MinActive titulo={"Envangelho!!!"} dataSelect={setData} img={activi} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                    <MinActive titulo={"Envangelho!!!"} dataSelect={setData} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                    <MinActive titulo={"Envangelho!!!"} dataSelect={setData} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                </div>
                <div className="grid grid-cols-3 gap-10 w-[900px] min-w-[900px]">
                    <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                    <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                    <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                </div>
                <div className="grid grid-cols-3 gap-10 w-[900px] min-w-[900px]">
                    <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                    <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                    <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                </div>
            </div>
        </div>
    </div>:<ActiviComplete data={complete}/>}    
       
       
    </>
}

export const SlidesActiviyMin = ({data}) => {
    return<div className=" justify-center flex flex-col items-center">
        <SlidesActiviy/>
    </div>
}


