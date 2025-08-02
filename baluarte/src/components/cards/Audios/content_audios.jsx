import { Link } from "react-router-dom"
import { GridAudios } from "./GridAudios"


export const ContentAudios=()=>{
    return <>
        <section className=" w-full shrink-0">
            <p className=" text-li-nav tracking-[1px] lg:w-1/2">Fortaleça sua fé, expanda seu conhecimento e caminhe 
            mais perto de Deus a cada leitura!</p>
            <div className="my-10 flex flex-col justify-center items-center ">
                <GridAudios />
                <Link to={"/Destaque/Audios"}><button className="buttonRectangle-white w-[400px] mt-20">Deseja ver mais audios na nossa playlist</button></Link>
            </div>

        </section>
    </>
}