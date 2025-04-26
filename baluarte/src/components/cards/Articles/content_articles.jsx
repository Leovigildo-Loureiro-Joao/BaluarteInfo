import { GridArticle } from "./gridArticle"

export const ContentArticle=()=>{
    return <>
        <section className="px-40 pt-0">
            <div className="h2-title sec">
                <h1>Nossos novos Artigos</h1>
                <span></span>
            </div>
            <p className=" text-li-nav">Fortaleça sua fé, expanda seu conhecimento e caminhe 
            mais perto de Deus a cada leitura!</p>
            <div className="my-10 flex flex-col justify-center items-center">
                <GridArticle/>
                <button className="buttonRectangle min mt-20">Saber mais</button>
            </div>

        </section>
    </>
}