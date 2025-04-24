import { useState } from "react"
import { ListItem } from "../../items-list/ListItem"
import { MinActive } from "./min-active";
import { quemsomos } from "../../../assets/Assets";

export const Actividade_Content=({data})=>{

    const [select,setSelect]=useState(0);
    return <>
           <section id="actividades" className="px-20">
            <div className="h2-title sec">
                <h1>Actividades em destaque</h1>
                <span></span>
            </div>
            <div className=" justify-center flex flex-col items-center">
                <nav className="flex w-[-webkit-fill-available] justify-center">
                    <ul className="flex w-1/2 justify-around tema">
                        <ListItem text={"Anual"} classe={select==0?"selected":""} setValue={setSelect} value={0} />
                        <ListItem text={"Mensal"} classe={select==1?"selected":""} setValue={setSelect} value={1}/>
                        <ListItem text={"Projecto"} classe={select==2?"selected":""} setValue={setSelect} value={2}/>
                    </ul>
                </nav>
                <div className="overflow-hidden">
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
                </div>
                
                <button className="buttonRectangle min mt-20">Saber mais</button>
            </div>
       
       </section>
       </>
}