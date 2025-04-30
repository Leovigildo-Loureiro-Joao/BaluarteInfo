import { artigo } from "../../../assets/Assets"
import { MinVideo } from "./min_video"


export const GridVideos=({data})=>{
    return <div id="Videos" className="grid grid-cols-3 gap-20 w-[70vw] min-w-[950px]">
       <MinVideo img={artigo}  titulo={"Artigo"}/>
       <MinVideo img={artigo} titulo={"Artigo"}/>
       <MinVideo img={artigo}  titulo={"Artigo"}/>
    </div>
}