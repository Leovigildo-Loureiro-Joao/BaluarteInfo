import { artigo } from "../../../assets/Assets"
import { MinArticle } from "../Articles/min-article"

export const GridArticle=({data})=>{
    return <div id="Artigos" className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-shrink-0 w-full max-w-[950px]">
       <MinArticle img={artigo} descricao={"Neste artigo, exploramos como Deus frequentemente age nas estações mais silenciosas e sombrias da vida — quando orações parecem sem resposta e os céus estão calados. A partir da narrativa de Elias no monte Horebe (1 Reis 19), refletimos sobre como o sussurro divino é mais poderoso que o terremoto e o fogo."
+"Aprenda a discernir a voz de Deus no vale, a redescobrir o propósito mesmo na dor, e a se firmar na promessa mesmo quando tudo parece estagnado. Porque às vezes, o silêncio de Deus é o prelúdio de um mover sobrenatural."} titulo={"Entre o Vale e a Promessa: Quando Deus Fala no Silêncio"}/>
       <MinArticle img={artigo} descricao={"Este e o arigo sobre a igreja teste 1"} titulo={"Artigo"}/>
       <MinArticle img={artigo} descricao={"Este e o arigo sobre a igreja teste 1"} titulo={"Artigo"}/>
    </div>
}