import { artigo } from "../../../assets/Assets"
import { MinVideo } from "./min_video"


export const GridVideos=({data})=>{
    return <div id="Videos" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-shrink-0 w-full max-w-[950px]">
       <MinVideo img={artigo} descricao={"sdfsdfs sd sdf s sdf sdfsdf ssffsdfsd sd sd sdf sdf sdfsd fsd"}  titulo={"Artigo"}/>
       <MinVideo img={artigo} descricao={"sdfsdfs sd sdf s sdf sdfsdf ssffsdfsd sd sd sdf sdf sdfsd fsd"} titulo={"Artigo"}/>
       <MinVideo img={artigo} descricao={"sdfsdfs sd sdf s sdf sdfsdf ssffsdfsd sd sd sdf sdf sdfsd fsd"} titulo={"Artigo"}/>
    </div>
}