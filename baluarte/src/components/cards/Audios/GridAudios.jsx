import { artigo } from "../../../assets/Assets"
import { MinAudio } from "./min_audio"


export const GridAudios=({data})=>{
    return <div className="grid grid-cols-3 gap-10 w-[70vw] max-w-[900px]">
       <MinAudio img={artigo} descricao={"Este e o arigo sobre a igreja teste 1"} titulo={"Artigo"}/>
       <MinAudio img={artigo} descricao={"Este e o arigo sobre a igreja teste 1"} titulo={"Artigo"}/>
       <MinAudio img={artigo} descricao={"Este e o arigo sobre a igreja teste 1"} titulo={"Artigo"}/>
    </div>
}