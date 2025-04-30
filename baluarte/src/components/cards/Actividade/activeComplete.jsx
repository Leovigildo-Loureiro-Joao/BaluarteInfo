import { FaArrowLeft } from "react-icons/fa6"
import { GridVideos } from "../Videos/GridVideos"
import { Galeria } from "./Galeria"
import { Link } from "react-router-dom"


export const ActiviComplete=({data})=>{

    if (data!=undefined) {
        return <section className=" flex flex-col gap-20 p-10 w-[70vw]">
            <div>
                <Link to={"/Actividade"}><FaArrowLeft  className="text-[20px] text-primary" /></Link>
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
                            <p>{data.descricao}</p>
                        </div>
                        <h3><strong>Publico alvo:</strong> {data.publicoAlvo}</h3>
                        <div className="flex gap-5">
                            <button className="buttonRectangle w-[150px]">Saber mais</button>
                            <button className="buttonRectangle-white w-[150px]">Baixar</button>
                        </div>
                    </div>
            </article>
          <Galeria/>
           <section className="relative">
                <div className="h2-title sec">
                    <h1>Nossos novos videos</h1>
                    <span></span>
                </div>
                <p className=" text-li-nav">Inspire-se com mensagens transformadoras e fortaleça sua 
                jornada de fé!</p>
                <div className="my-10 flex flex-col justify-center items-center">
                    <GridVideos />
                </div>
            </section>
        </section>
    }
   
   
}