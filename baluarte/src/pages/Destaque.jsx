import { salvacao } from "../assets/Assets"
import { ContentArticle } from "../components/cards/Articles/content_articles"
import { ContentAudios } from "../components/cards/Audios/content_audios"
import { ContentVideo } from "../components/cards/Videos/content_videos"

export const Destaque=()=>{

    return < section className="flex gap-20 flex-col">
        <section className="bg-missao-visao bg-no-repeat bg-cover h-full relative -top-56 py-96 flex gap-10">
            <figure className="w-1/2">
                <img src={salvacao} alt="" className="w-full max-w-[500px]" />
            </figure>
            <div className="w-1/3">
                <div className="py-10">
                    <h1 className="text-primary text-h1-Big font-bold py-10">Salvação hoje!!!</h1>
                    <p className="text-li-nav ">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti assumenda qui aperiam adipisci eum excepturi hic nulla nobis, recusandae, ratione quidem maiores at inventore explicabo minima earum veniam, voluptatem sint.</p>
                </div>
                <div className="flex gap-10">
                    <button className="buttonRectangle min">Saber mais</button>
                    <button className="buttonRectangle-white min">Saber mais</button>
                </div>
            </div>
        </section>
        <ContentArticle/>
        <ContentAudios/>
        <ContentVideo/>
    </section>
}