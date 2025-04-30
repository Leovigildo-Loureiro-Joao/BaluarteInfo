import { Link } from "react-router-dom"
import { perfil } from "../assets/Assets"
import { SlidesActiviy } from "../components/cards/Actividade/slides-active"

export const Perfil=()=>{
    
    return <section className="p-20 flex flex-col items-center">
        <figure className="flex justify-center  gap-5 flex-col pb-20 items-center">
            <img src={perfil} alt="" className="perfil w-[150px] h-[150px]"/>
            <figcaption className="flex flex-col itens-center text-center gap-5">
                <h2 className="text-text-pargh">leovigildojaoa@gmail.com</h2>
                <h1 className="text-h2-title font-bold">Leovigildo João</h1>
            </figcaption>
        </figure>
       <div className="flex justify-center flex-col items-center">
        <SlidesActiviy/>
       </div>
        <div className="flex flex-col gap-5 w-[900px] pt-20">
            <div className="flex flex-col gap-5 w-min whitespace-nowrap pt-20">
                <Link><p className="hover:text-primary transition-all duration-300">Editar perfil</p></Link>
                <Link><p className="hover:text-primary transition-all duration-300">Remover conta</p></Link>
                <Link><p className="hover:text-primary transition-all duration-300">Entre em contacto com a igreja</p></Link>
            </div>
        </div>
    </section>

}