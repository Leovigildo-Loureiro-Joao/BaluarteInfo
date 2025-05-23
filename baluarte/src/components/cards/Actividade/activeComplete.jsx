import { FaArrowLeft } from "react-icons/fa6"
import { GridVideos } from "../Videos/GridVideos"
import { Galeria } from "./Galeria"
import { Link } from "react-router-dom"
import { GridComentario } from "../Comentario/gridComentario"
import { useModal } from "../../Dialog/ModalContext"


export const ActiviComplete=({data})=>{
  const { openModal } = useModal();
    function OpenModal() {
        openModal("modalComentar", {
            useName:"LEo"
        })
    }
    if (data!=undefined) {
        return <section className=" flex flex-col gap-20 p-10 w-[70vw]">
            <div>
                <Link to={"/Actividade"}><FaArrowLeft  className="text-[20px] text-primary" /></Link>
            </div>
            
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

            <section className="flex flex-col justify-center items-center gap-10">
                <div className="h2-title">
                    <h1 className="text-h2-title-big text-primary">Comentarios</h1>
                    <span className="bg-primary p-px "></span>
                </div>
               
                <GridComentario/>
                <button className="buttonRectangle w-[200px] mt-20" onClick={OpenModal} >Adicionar comentario</button>
            </section>
        </section>
    }
   
   
}