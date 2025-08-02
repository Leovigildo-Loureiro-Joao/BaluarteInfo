import { RxPlus } from "react-icons/rx"

export const ModalComentar=({userName,closeModal})=>{

    return <dialog className="w-[400px] h-[350px] min-h-[350px] bg-white rounded-xl flex flex-col static">
            <div>
               <div className="flex justify-between p-10 pb-1"><h2 className="text-h2-title font-bold text-primary">Comentario</h2><RxPlus onClick={closeModal} className=" text-4xl transition-all duration-300 rotate-45 hover:text-primary hover:shadow-inner"/></div>
              <div className="p-10 pt-5 flex gap-10 flex-col">
                  <textarea className=" p-5 border-[1px] border-solid border-[#d6d6d6] resize-none h-[200px] w-[350px] outline-none text-text-pargh" placeholder="Insira aqui o seu comentario">

                  </textarea>
                  <button className="buttonRectangle">Enviar comentario</button>
              </div>
            </div>
       </dialog>
       
    }