import { RxPlus } from "react-icons/rx"


export const ModalPerfil=({userName,closeModal})=>{

    return <div className="md:max-w-[400px] w-full h-[200px] min-h-[350px] bg-white rounded-xl flex flex-col absolute md:bottom-auto bottom-0 ">
            <div>
               <div className="flex justify-between p-10 pb-1"><h2 className="text-h2-title font-bold text-primary">Editar perfil</h2><RxPlus onClick={closeModal} className=" text-4xl transition-all duration-300 rotate-45 hover:text-primary hover:shadow-inner"/></div>
              <div className="p-10 pt-5 flex gap-5 flex-col">
                    <input className="inputLine" placeholder="Insira o seu nome" type="text"/>
                    <input className="inputLine" placeholder="Insira o seu email" type="email"/>
                  <button className="buttonRectangle mt-52">Editar</button>
              </div>
            </div>
       </div>
       
    }