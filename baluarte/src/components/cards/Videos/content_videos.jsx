import { GridVideos } from "./GridVideos"


export const ContentVideo=()=>{
    return <>
        <section >
            <p className=" text-li-nav tracking-[2px] leading-[30px]" >Fortaleça sua fé, expanda seu conhecimento e caminhe 
            mais perto de Deus a cada leitura!</p>
            <div className="my-10 flex flex-col justify-center items-center">
                <GridVideos />
            </div>

        </section>
    </>
}