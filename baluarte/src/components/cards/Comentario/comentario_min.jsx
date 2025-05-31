import { perfil } from "../../../assets/Assets"

export const ComentarioMin=()=>{
    return <article className="w-[50vw] flex  bg-white rounded-xl shadow-xl justify-center gap-5 p-4 ">
        <figure>
            <img src={perfil} alt="" className="perfil w-[50px] h-[50px]"/>
           
        </figure>
        <div>
            <p className="text-primary pt-7">Leovigildo João</p>
            <div className="h-[150px] overflow-y-auto w-full max-w-[500px]">
           
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore maxime veniam quia. Distinctio, maiores facilis quis possimus quia obcaecati ad natus magnam, quibusdam voluptatum eaque enim quas dicta, omnis sed?
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore maxime veniam quia. Distinctio, maiores facilis quis possimus quia obcaecati ad natus magnam, quibusdam voluptatum eaque enim quas dicta, omnis sed?
                </p>
            </div>
        </div>
       
    </article>
}