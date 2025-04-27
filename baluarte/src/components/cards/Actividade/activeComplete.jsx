import { FaArrowLeft, FaLeftLong } from "react-icons/fa6"
import { LiaArrowAltCircleLeft } from "react-icons/lia"
import { activi, artigo, quemsomos } from "../../../assets/Assets"
import { ContentVideo } from "../Videos/content_videos"
import { GridVideos } from "../Videos/GridVideos"


export const ActiviComplete=({data})=>{
    if (data!=undefined) {
        return <section className=" flex flex-col gap-20 p-10 w-[70vw]">
            <div>
                <FaArrowLeft  className="text-[20px] text-primary" />
            </div>
            <article className="flex gap-10">
                    <figure className="w-[20vw] max-w-[20vw]">
                        <img src={data.img} alt="" className="rounded-xl object-cover h-[400px] w-[20vw] max-w-[273px]"/>
                    </figure>
                    <div className="w-[55vw] flex flex-col gap-5">
                        <h1 className="text-primary text-subtitle font-bold">{data.titulo}</h1>
                        <h2 className="text-primary text-h2-title font-semibold"><strong>Tema:</strong> {data.tema}</h2>
                        <h3 className="text-primary text-text-pargh font-semibold"><strong>Tipo de Evento:</strong> {data.tipoEvento}</h3>
                        <h3><strong>Organizador: </strong>{data.Organizdor}</h3>
                        <div className="max-w-[300px]">
                            <h3><strong>Descricao</strong></h3>
                            <p c>{data.descricao}</p>
                        </div>
                        <h3><strong>Publico alvo:</strong> {data.publicoAlvo}</h3>
                        <div className="flex gap-5">
                            <button className="buttonRectangle w-[150px]">Saber mais</button>
                            <button className="buttonRectangle-white w-[150px]">Baixar</button>
                        </div>
                    </div>
            </article>
            <div>
                <div>
                    <div className="h2-title sec">
                        <h1>Galeria de fotos</h1>
                        <span></span>
                    </div>
                    <p className="w-[50%]">
                        Reviva os momentos especiais das nossas atividades através da nossa galeria! 
                        Aqui você encontrará imagens inspiradoras que capturam a essência de cada evento, 
                        desde momentos de oração e louvor até comunhão e celebração. 
                        Deixe-se envolver pela atmosfera única de cada encontro e prepare-se para participar
                        das próximas experiências!
                    </p>
                </div>
                <div className="flex gap-10 mt-10">

                    <figure className="rect-image">
                        <img src={quemsomos} alt="" />
                    </figure>
                    <figure className="rect-image">
                        <img src={quemsomos} alt="" />
                    </figure>
                    <figure className="rect-image">
                        <img src={activi} alt="" />
                    </figure>
                    <figure className="rect-image">
                        <img src={quemsomos} alt="" />
                    </figure>
                    <figure className="rect-image">
                        <img src={quemsomos} alt="" />
                    </figure>
                </div>
            </div>
           <section className="relative">
                <div className="h2-title sec">
                    <h1>Nossos novos videos</h1>
                    <span></span>
                </div>
                <p className=" text-li-nav">Inspire-se com mensagens transformadoras e fortaleça sua 
                jornada de fé!</p>
                <div className="my-10 flex flex-col justify-center items-center">
                    <GridVideos />
                    <button className="buttonRectangle min mt-20">Saber mais</button>
                </div>
            </section>
        </section>
    }
   
   
}