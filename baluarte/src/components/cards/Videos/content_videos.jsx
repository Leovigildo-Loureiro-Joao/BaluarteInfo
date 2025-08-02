import { Link } from "react-router-dom"
import { GridVideos } from "./GridVideos"


export const ContentVideo=()=>{
    return <>
        <section className=" w-full shrink-0">
            <p className=" text-li-nav tracking-[1px] lg:w-1/2" >Fortaleça sua fé, expanda seu conhecimento e caminhe 
            mais perto de Deus a cada leitura!</p>
            <div className="my-10 flex flex-col justify-center items-center">
                <GridVideos />
                <Link to={"/Destaque/Videos"}><button className="buttonRectangle min mt-20">Ver mais videos</button></Link>
                
            </div>
            
        </section>
    </>
}