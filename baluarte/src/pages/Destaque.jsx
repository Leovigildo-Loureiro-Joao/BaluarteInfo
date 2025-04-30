import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom"
import { salvacao } from "../assets/Assets"
import { ContentArticle } from "../components/cards/Articles/content_articles"
import { ContentAudios } from "../components/cards/Audios/content_audios"
import { ContentVideo } from "../components/cards/Videos/content_videos"
import { GridArticle } from "../components/cards/Articles/gridArticle"
import { ListItem } from "../components/items-list/ListItem"
import { useState } from "react"
import { GridAudios } from "../components/cards/Audios/GridAudios"
import { GridVideos } from "../components/cards/Videos/GridVideos"
import { LiaSearchSolid } from "react-icons/lia"

export const Destaque=(value)=>{
   
    const seccao=useParams("seccao").seccao
    const [select,setSelect]=useState(0);
   
       
    return < section className="flex gap-20 flex-col" >
        <section className="bg-missao-visao bg-no-repeat bg-cover h-full relative -top-56 py-96 flex gap-10">
            <figure className="w-1/2">
                <img src={salvacao} alt="" className="w-full max-w-[500px]" />
            </figure>
            <div className="w-1/3">
                <div className="py-10">
                    <h1 className="text-primary text-h1-Big font-bold py-10">Salvação hoje!!!</h1>
                    <p className="text-li-nav ">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti assumenda qui aperiam adipisci eum excepturi hic nulla nobis, recusandae, ratione quidem maiores at inventore explicabo minima earum veniam, voluptatem sint.</p>
                </div>
                <div className="flex gap-10">
                    <Link to={"/Salvacao"}><button className="buttonRectangle min">Saber mais</button></Link>
                </div>
            </div>
        </section>
       <section className="flex justify-center items-center -mt-96 relative z-10">
            <section className="flex justify-center flex-col items-center">
                <div className="flex w-[980px] justify-between">
                    <div className="flex items-center pb-32">
                        <input type="text" placeholder="Pesquisar actividade" name="" id="" className=" w-[400px] h-20 pl-10 rounded-lg border-solid border border-gray-950/50 outline-0"/>
                        <LiaSearchSolid className="relative -left-16" size={"2rem"}/>
                    </div>
                    <nav className="flex justify-start pb-5 -ml-5">
                        <ul className="flex w-1/2 gap-5 tema">
                            <ListItem text={"Audios"} classe={select==0?"selected":""} setValue={setSelect} value={0} />
                            <ListItem text={"Videos"} classe={select==1?"selected":""} setValue={setSelect} value={1}/>     
                            <ListItem text={"Artigos"} classe={select==2?"selected":""} setValue={setSelect} value={2}/>     
                        </ul>
                    </nav>
                </div>
                <section className="w-[990px] overflow-hidden">
                    <section className="flex  gap-20" style={{
                                    transform: `translateX(-${select * 990}px)`,
                                    transition: "transform 0.5s ease-in-out"
                                }}>
                        <GridAudios/>
                        <GridVideos/>
                        <GridArticle/>
                    </section>
                </section>
                
            </section>
       
       </section>
    </section>
}