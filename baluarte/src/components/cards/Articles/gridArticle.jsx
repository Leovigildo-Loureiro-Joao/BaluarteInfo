import { artigo } from "../../../assets/Assets"
import { MinArticle } from "../Articles/min-article"

export const GridArticle=({data})=>{
    return <div id="Artigos" className="grid grid-cols-3 gap-20 w-[70vw] min-w-[950px]">
       <MinArticle img={artigo} descricao={"Este e o arigo sobre a igreja teste 1"} titulo={"Artigo"}/>
       <MinArticle img={artigo} descricao={"Este e o arigo sobre a igreja teste 1"} titulo={"Artigo"}/>
       <MinArticle img={artigo} descricao={"Este e o arigo sobre a igreja teste 1"} titulo={"Artigo"}/>
    </div>
}