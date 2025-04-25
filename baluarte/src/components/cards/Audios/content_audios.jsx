import { GridAudios } from "./GridAudios"


export const ContentAudios=()=>{
    return <>
        <section className="px-40 pt-0 relative -top-96">
            <div className="h2-title sec">
                <h1>Audios mais requisitados</h1>
                <span></span>
            </div>
            <p className=" text-li-nav">Fortaleça sua fé, expanda seu conhecimento e caminhe 
            mais perto de Deus a cada leitura!</p>
            <div className="my-10 flex flex-col justify-center items-center">
                <GridAudios />
                <button className="buttonRectangle min mt-20">Saber mais</button>
            </div>

        </section>
    </>
}