import { perfil } from "../../../assets/Assets"

export const ComentarioMin=()=>{
    return <article className="w-[350px] flex flex-col bg-white rounded-xl shadow-xl justify-center items-center gap-5 p-20 text-center">
        <figure>
            <img src={perfil} alt="" className="perfil w-[100px] h-[100px]"/>
            <figcaption>
                <p className="text-primary pt-7">Leovigildo João</p>
            </figcaption>
        </figure>
        <div className="h-[150px] overflow-y-auto">
            <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore maxime veniam quia. Distinctio, maiores facilis quis possimus quia obcaecati ad natus magnam, quibusdam voluptatum eaque enim quas dicta, omnis sed?
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore maxime veniam quia. Distinctio, maiores facilis quis possimus quia obcaecati ad natus magnam, quibusdam voluptatum eaque enim quas dicta, omnis sed?
            </p>
        </div>
    </article>
}