import { RxPlus } from "react-icons/rx"
import { useModal } from "./ModalContext";

export const ModalPassword=({userName,closeModal})=>{
const { openModal } = useModal();
        function OpenModal() {
            openModal("modalPassword", {
               nome:""
            })
        }
    return <div className="md:max-w-[400px] w-full h-[200px] min-h-[350px] bg-white rounded-xl flex flex-col  md:bottom-auto bottom-0 absolute">
            <div>
               <div className="flex justify-between p-10 pb-1"><h2 className="text-h2-title font-bold text-primary">Editar password</h2><RxPlus onClick={closeModal} className=" text-4xl transition-all duration-300 rotate-45 hover:text-primary hover:shadow-inner"/></div>
              <div className="p-10 pt-5 flex gap-5 flex-col">
                    <input className="inputLine" placeholder="Insira a sua senha antiga" type="password"/>
                    <input className="inputLine" placeholder="Insira a sua nova senha" type="password"/>
                    <input className="inputLine" placeholder="Insira a senha de comfirmação" type="password"/>
                  <button className="buttonRectangle mt-20">Editar</button>
              </div>
            </div>
       </div>
       
    }