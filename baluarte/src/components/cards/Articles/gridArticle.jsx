import { artigo } from "../../../assets/Assets"
import { MinArticle } from "../Articles/min-article"

export const GridArticle=({data})=>{
    return <div className="grid grid-cols-3 gap-10 w-[70vw] min-w-[900px]">
       <MinArticle img={artigo} descricao={"Este e o arigo sobre a igreja teste 1"} titulo={"Artigo"}/>
       <MinArticle img={artigo} descricao={"Este e o arigo sobre a igreja teste 1"} titulo={"Artigo"}/>
       <MinArticle img={artigo} descricao={"Este e o arigo sobre a igreja teste 1"} titulo={"Artigo"}/>
    </div>
}