import { artigo } from "../../../assets/Assets"
import { Retrato_Article } from "./retrato_article"

export const SlideArticle=({index})=>{
    return <section className="w-[620px] flex overflow-hidden">
        <div className="w-auto flex gap-[20px]"  style={{
            transform: `translateX(-${index * 600}px)`,
            transition: "transform 0.5s ease-in-out"
        }}>
            <Retrato_Article img={artigo} 
            descricao={"Perhaps we should also point out the fact that one of the basic feature commits resources to The Rule of Enhanced Practice (Burton Abbott in The Book of the Interactive Services Detection)"} 
            titulo={"Artigo"}/>
            <Retrato_Article img={artigo} 
            descricao={"Perhaps we should also point out the fact that one of the basic feature commits resources to The Rule of Enhanced Practice (Burton Abbott in The Book of the Interactive Services Detection)"} 
            titulo={"Artigo"}/>
            <Retrato_Article img={artigo} 
            descricao={"Perhaps we should also point out the fact that one of the basic feature commits resources to The Rule of Enhanced Practice (Burton Abbott in The Book of the Interactive Services Detection)"} 
            titulo={"Artigo"}/>
        </div>

    </section>
}