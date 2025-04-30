import { artigo } from "../../../assets/Assets"
import { MinAudio } from "./min_audio"


export const GridAudios=({data})=>{
    return <div id="Audios" className="grid grid-cols-3 gap-20 w-[950px] max-w-[1200px] min-w-[950px]">
       <MinAudio img={artigo} descricao={"O que é a fé, como ela impacta a vida dos santos, como ela serve como escudo das armadilhas do Diabo "} titulo={"Fé significado"}/>
       <MinAudio img={artigo} descricao={"Este e o arigo sobre a igreja teste 1"} titulo={"Artigo"}/>
       <MinAudio img={artigo} descricao={"Este e o arigo sobre a igreja teste 1"} titulo={"Artigo"}/>
    </div>
}