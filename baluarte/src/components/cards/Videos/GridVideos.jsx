import { artigo } from "../../../assets/Assets"
import { MinVideo } from "./min_video"


export const GridVideos=({data})=>{
    return <div className="grid grid-cols-3 gap-10 w-[70vw] min-w-[900px]">
       <MinVideo img={artigo}  titulo={"Artigo"}/>
       <MinVideo img={artigo} titulo={"Artigo"}/>
       <MinVideo img={artigo}  titulo={"Artigo"}/>
    </div>
}