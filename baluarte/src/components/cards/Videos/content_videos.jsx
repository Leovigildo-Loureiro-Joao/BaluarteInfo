import { GridVideos } from "./GridVideos"


export const ContentVideo=()=>{
    return <>
        <section >
            <p className=" text-li-nav tracking-[1px] w-1/2" >Fortaleça sua fé, expanda seu conhecimento e caminhe 
            mais perto de Deus a cada leitura!</p>
            <div className="my-10 flex flex-col justify-center items-center">
                <GridVideos />
                <button className="buttonRectangle min mt-20">Ver mais videos</button>
            </div>
            
        </section>
    </>
}