import { RxExit, RxMinus, RxPlay, RxPlus } from "react-icons/rx"
import { icone, music } from "../../assets/Assets"
import { ListItem } from "../items-list/ListItem"
import { useState } from "react"
import { FaXmark } from "react-icons/fa6"
import { Download, Share2 } from "lucide-react"

export const ModalAudio=({titulo,tipo,relacionados=[],audio=music,src,descricao,closeModal})=>{

    const [select,setSelect]=useState(0)

    return <dialog className="w-[750px] h-[550px] min-h-[550px] bg-white rounded-xl flex flex-col static">
           <div className=" rounded-xl p-10 flex pr-12 bg-white w-full z-50 max-w-[1000px] h-[80px] items-center justify-between">
                  <div className="flex items-center bg-white rounded-xl">
                    <img src={icone} alt="Logo" className="w-20" />
                    <h1>
                      <span className="font-thin text-2xl">Igreja</span>
                      <br />
                      <span className="text-4xl font-semibold">Baluarte</span>
                    </h1>
                  </div>
                 <div className="flex items-center gap-10">
                 <p className="text-center text-gray-500 italic">
                  "Conheça a verdade. Fortaleça sua fé."
                </p>
                  <button onClick={closeModal} className=" text-gray-500 hover:text-primary transition-all duration-300"><FaXmark size={24}/></button>
                 </div>
                </div>
            <div className=" flex gap-5 ">
              <div>
                </div>

                <div className="flex flex-col justify-center items-center gap-10">
                    <figure className="w-[400px] px-[15px] h-[160px] flex justify-center">
                        <img
                        src={src}
                        alt="Imagem da atividade"
                        className="object-cover rounded-xl object-center h-[160px] w-[300px]"
                        />
                    </figure>
                    <audio src={audio} controls className="w-3/4 bg-transparent"></audio>
                    <div className="flex gap-4 p-10 pt-0 text-sm text-gray-600">
                        <button className="flex items-center gap-1 text-xl hover:text-blue-600">
                        <Share2 size={20} /> Partilhar
                        </button>
                        <a href={audio} download className="text-xl flex items-center gap-1 hover:text-green-600">
                        <Download size={20} /> Baixar
                        </a>
                    </div>
                </div>
                <div className="flex flex-col gap-5 w-full  border-l border-solid border-gray-300 p-5 h-full">
                  <div className="flex flex-col gap-5 w-full">
                      <h2 className="text-h2-title text-primary font-semibold">Titulo</h2>
                      <p className="text-gray-600">{titulo}</p>
                  </div>
                    <p className="text-primary font-bold">{tipo}</p>
                  <div className="max-w-[250px] max-h-[240px] overflow-x-hidden overflow-y-auto">
                      <h2 className="text-h2-title text-primary font-semibold mb-5">Descricao</h2>
                      <p className="text-gray-600">
                          {descricao}
                      </p>
                  </div>
                </div>
              </div>
                  <div className=" border-t  border-solid border-gray-300 gap-10 w-full p-10 px-14">
                      <h2 className="text-h2-title text-primary font-semibold">Audios relacionados</h2>
                     <div className="flex flex-wrap gap-5">
                     {relacionados.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 p-3 rounded-lg shadow hover:shadow-lg cursor-pointer flex gap-5 transition-all"
                        onClick={() => console.log("Selecionado:", item.titulo)}
                      >
                        <figure className="h-[50px] w-[50px] section-img rounded-full">
                          <img className="rounded-full" src={item.src} alt="" />
                        </figure>
                    <div>
                    <h5 className="font-bold text-xl">{item.titulo}</h5>
                      <span className="text-sm text-primary">{item.tipo}</span>
                      </div>
                    </div>
                  ))}
                     </div>
                </div>
              
        </dialog> 
}