import { FaFacebook, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { wave } from "../../assets/Assets"
import { Link } from 'react-router-dom';

export const Footer=()=>{
    return <footer className="">
       <img src={wave}/> 
       <div className="bg-min-white  h-96">
            <div className="flex justify-around items-center relative -top-5">
                <div className="flex flex-col justify-around">
                    <h2 className="h2-title">Inscreva-se já</h2>
                    <div className="flex flex-col justify-around gap-5 w-[400px]">
                        <input type="text"  className="inputRectangle" placeholder="Nome"/>
                        <input type="email" className="inputRectangle" placeholder="Email"/>
                        <button className="buttonRectangle">Enviar</button>
                    </div>
                </div>
                <div className="flex justify-between flex-col w-1/3 gap-10"> 
                    <div>
                        <h2 className="h2-title">Destaque</h2>
                        <nav >
                            <ul className="flex gap-5">
                                <li><Link to="/Destaque/Artigos">Artigos</Link></li>
                                <li><Link to="/Destaque/Videos">Videos</Link></li>
                                <li><Link to="/Destaque/Audios">Audios</Link></li>
                                <li><Link to="/Salvacao">Salvação hoje !</Link></li>
                            </ul>
                        </nav>
                        
                    </div>
                    <div className=" flex justify-between">
                        <div>
                            <h2 className="h2-title">Links uteis</h2>
                            <ul className='gap-2 flex flex-col'>
                                <li><a href="#quemsomos">Quem somos</a></li>
                                <li><a href="#missao">Missão e Visão</a></li>
                                <li><a href="#actividades">Actividades em destaque</a></li>
                                <li><a href="#">Contactos</a></li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="h2-title"> Redes Sociais</h2>
                            <ul className='flex gap-5'>
                                <li>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                        <FaFacebook size={20} className="hover:text-blue-500 transition" />
                                    </a>
                                </li>
                                <li>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                        <FaYoutube size={20} className="hover:text-red-600 transition" />
                                    </a>
                                </li>
                                <li>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                        <FaWhatsapp size={20} className="hover:text-green-500 transition" />
                                    </a>
                                </li>
                            </ul>   
                        </div>
                    </div>
                
                </div>
            </div>
       </div>
    </footer>
}