import {icone} from "../../assets/Assets"


export const Header=()=>{
    return <section className={`relative bg-cover bg-center h-96 bg-fundo-baluarte `} >
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
            <div>
                <h2 className="title-min-white text-end text-subtitle py-10">Salmos 23:1</h2>
                <p className="text-min-white text-li-nav">"O Senhor é o meu pastor, nada me faltará."</p>
            </div>

        </div>
        <nav className="flex justify-end px-20 relative -top-5"> 
            <ul className="flex justify-center gap-10">
                <li className="liNavBar selected"><span></span><p>Pagina Inical</p></li>
                <li className="liNavBar"><span></span><p>Actividades</p></li>
                <li className="liNavBar"><span></span><p>Destaque</p></li>
                <li className="liNavBar"><span></span><p>Contactos</p></li>
            </ul>
        </nav>
    </div>
    
    
  </section>
}