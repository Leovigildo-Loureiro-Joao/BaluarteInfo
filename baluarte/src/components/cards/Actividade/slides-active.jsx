import { useState } from "react";
import { quemsomos } from "../../../assets/Assets";
import { ListItem } from "../../items-list/ListItem";
import { MinActive } from "./min-active";

export const SlidesActiviy = ({data}) => {
    const [select,setSelect]=useState(0);
    return <> <nav className="flex w-[-webkit-fill-available] justify-center">
    <ul className="flex w-1/2 justify-around tema">
        <ListItem text={"Anual"} classe={select==0?"selected":""} setValue={setSelect} value={0} />
        <ListItem text={"Mensal"} classe={select==1?"selected":""} setValue={setSelect} value={1}/>
        <ListItem text={"Projecto"} classe={select==2?"selected":""} setValue={setSelect} value={2}/>
        
    </ul>
</nav>
<div className="overflow-hidden w-[70vw]">
    <div className="m-10 flex gap-[10vw] w-[70vw]"  style={{
            transform: `translateX(-${select * 75}vw)`,
            transition: "transform 0.5s ease-in-out"
        }}>
        <div className="grid grid-cols-3 gap-10 w-[70vw] min-w-[900px]">
            <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
            <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
            <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
        </div>
        <div className="grid grid-cols-3 gap-10 w-[70vw] min-w-[900px]">
        <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
            <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
            <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
        </div>
        <div className="grid grid-cols-3 gap-10 w-[70vw] min-w-[900px]">
        <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
            <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
            <MinActive titulo={"Envangelho!!!"} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
        </div>
    </div>
</div></>
}

export const SlidesActiviyMin = ({data}) => {
    return<div className=" justify-center flex flex-col items-center">
        <SlidesActiviy/>

        <button className="buttonRectangle min mt-20">Saber mais</button>
    </div>
}