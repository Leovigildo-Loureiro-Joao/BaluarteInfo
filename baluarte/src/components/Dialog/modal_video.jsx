import { RxExit, RxMinus, RxPlay, RxPlus } from "react-icons/rx"
import { icone, music } from "../../assets/Assets"
import { ListItem } from "../items-list/ListItem"
import { useState } from "react"
import { FaXmark } from "react-icons/fa6";
import { YouTubeVideo } from "../cards/Videos/Youtube";


export const ModalVideo=({titulo,descricao,video,tipo,closeModal,relacionados})=>{

    return <dialog className="w-[850px] h-[550px] min-h-[550px] bg-white rounded-xl flex flex-col static">
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
            <YouTubeVideo videoId={video} />
            <div className="flex flex-col gap-5 w-full  border-l border-solid border-gray-300 p-5 h-full">
              <div className="flex flex-col gap-5 w-full">
                  <h2 className="text-h2-title text-primary font-semibold">Titulo</h2>
                  <p className="text-gray-600">{titulo}</p>
              </div>
                <p className="text-primary font-bold">{tipo}</p>
              <div className="max-w-[200px] max-h-[240px] overflow-x-hidden overflow-y-auto">
                  <h2 className="text-h2-title text-primary font-semibold mb-5">Descricao</h2>
                  <p className="text-gray-600">
                      {descricao}
                  </p>
              </div>
            </div>
          </div>
              <div className=" gap-5 w-full p-10 px-14">
                  <h2 className="text-h2-title text-primary font-semibold">Video relacionados</h2>
                 <div className="flex flex-wrap gap-10">
                 {relacionados.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-3 rounded-lg shadow hover:shadow-lg cursor-pointer flex gap-10 transition-all"
                    onClick={() => console.log("Selecionado:", item.titulo)}
                  >
                    <figure className="h-[50px] w-[50px] section-img">
                      <img className="" src={item.src} alt="" />
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