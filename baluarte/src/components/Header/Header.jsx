import { useState } from "react"
import {icone, perfil, quemsomos} from "../../assets/Assets"
import {Link, useNavigate} from 'react-router-dom'

export const Header=()=>{
    const [select,setSelect]=useState(["","","","",""]);
    return <section className={`relative bg-cover z-10 bg-center h-[28rem] bg-fundo-baluarte `} >
    <div className="absolute z-0 inset-0 bg-sombra-vermelha/40"></div> 
    <div className="z-10 relative flex flex-col"> 
        <div className="flex justify-between p-20">
            <div className=" flex h-min">
                <img src={icone} className="w-28"/>
                <h1>
                    <span className="text-white text-h1-Big font-thin">Igreja</span>
                    <br/>
                    <span className="text-white text-8xl font-semibold">Baluarte</span>
                </h1>
            </div>
            <div className="flex flex-col">
                <figure className="flex justify-end">
                    <Link to="/Perfil/1"><img src={perfil} className="perfil w-[50px] h-[50px]"/></Link>
                </figure>
                <h2 className="title-min-white text-end text-subtitle py-10">Salmos 23:1</h2>
                <p className="text-min-white text-li-nav">"O Senhor é o meu pastor, nada me faltará."</p>
            </div>

        </div>
        <nav className="flex justify-end px-20 relative -top-5"> 
            <ul className="flex justify-center gap-10">
                <Link to="/"><li onClick={()=>{setSelect(["selected","","",""])}} className={"liNavBar "+(select[0])}><span></span><p>Pagina Inical</p></li></Link>
                <Link to="/Actividade"><li onClick={()=>{setSelect(["","selected","",""])}} className={"liNavBar "+(select[1])}><span></span><p>Actividades</p></li></Link>
                <Link to="/Destaque"><li onClick={()=>{setSelect(["","","selected",""])}} className={"liNavBar "+(select[2])}><span></span><p>Destaque</p></li></Link>
                <Link to="/MidiaDocs"><li onClick={()=>{setSelect(["","","","selected"])}} className={"liNavBar "+(select[3])}><span></span><p>Midia e Docs</p></li></Link>
                <li className={"liNavBar"}><span></span><p>Contactos</p></li>
             
            </ul>
        </nav>
    </div>
  </section>
}