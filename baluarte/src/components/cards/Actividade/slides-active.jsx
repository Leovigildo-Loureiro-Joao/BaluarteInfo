import { useState } from "react";
import { activi, quemsomos } from "../../../assets/Assets";
import { ListItem } from "../../items-list/ListItem";
import { MinActive } from "./min-active";
import { ActiviComplete } from "./activeComplete";
import { useParams } from "react-router-dom";

export const SlidesActiviy = ({data}) => {
    const [select,setSelect]=useState(-1);
    const id=useParams("id").id
 
    const Box=()=>{
        return  
    }
    const [selectData,setData]=useState();
    return <> 
        <nav className="flex w-[-webkit-fill-available] justify-center">
            <ul className="flex flex-wrap justify-around tema lg:w-[70vw] w-screen">
                <ListItem text={location.pathname.includes("Perfil")?"Participadas":"Anual"} classe={select==0?"selected":""} setValue={setSelect} value={0} />
                <ListItem text={location.pathname.includes("Perfil")?"Pendentes":"Mensal"} classe={select==-1?"selected":""} setValue={setSelect} value={-1}/>
                <ListItem text={location.pathname.includes("Perfil")?"Ignoradas":"Projecto"} classe={select==-2?"selected":""} setValue={setSelect} value={-2}/>        
            </ul>
        </nav>
       
            {id==undefined?<div >
        <div id="total"  className=" w-full max-w-[1000px] overflow-hidden relative flex justify-center" >
            <div className="m-10 flex transition-transform duration-500 "  style={{
                    transform: `translateX(calc(${select} * 100%))`,
                    transition: "transform 0.5s ease-in-out"
                }}>
                <div className={`grid-active ${select==0?"selected":""}`}>
                    <MinActive titulo={"Envangelho!!!"} data={"Domingo, 23 Jun – 19h  "} dataSelect={setData} img={activi} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                    <MinActive titulo={"Envangelho!!!"} data={"Domingo, 23 Jun – 19h  "} dataSelect={setData} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                    <MinActive titulo={"Envangelho!!!"} data={"Domingo, 23 Jun – 19h  "} dataSelect={setData} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                </div>
                <div className={`grid-active ${select==-1?"selected":""}`}>
                    <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                    <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                    <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                </div>
                <div className={`grid-active ${select==-2?"selected":""}`}>
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


