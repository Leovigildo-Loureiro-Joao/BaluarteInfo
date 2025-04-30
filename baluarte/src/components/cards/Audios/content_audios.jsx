import { GridAudios } from "./GridAudios"


export const ContentAudios=()=>{
    return <>
        <section>
            <p className=" text-li-nav tracking-[1px] w-[50%]">Fortaleça sua fé, expanda seu conhecimento e caminhe 
            mais perto de Deus a cada leitura!</p>
            <div className="my-10 flex flex-col justify-center items-center">
                <GridAudios />
                <button className="buttonRectangle-white w-[400px] mt-20">Deseja ver mais audios na nossa playlist</button>
            </div>

        </section>
    </>
}