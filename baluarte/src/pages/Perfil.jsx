import { Link } from "react-router-dom"
import { perfil } from "../assets/Assets"
import { SlidesActiviy } from "../components/cards/Actividade/slides-active"
import { FaImage } from "react-icons/fa6";
import { useModal } from "../components/Dialog/ModalContext";
import { SearchActividade } from "../components/cards/Actividade/SeachActividade";

export const Perfil=()=>{

    

    const { openModal } = useModal();
        function OpenModalPerfil() {
            openModal("modalPerfil", {
               nome:""
            })
        }

        function OpenModalSenha() {
            openModal("modalPassword", {
               nome:""
            })
        }


    function BuscarImagem() {
        const input = document.getElementById("busca");
        input.click();
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.querySelectorAll(".perfil").forEach(img => {
                        img.src = event.target.result;
                    }
                    );
                };
                reader.readAsDataURL(file);
            }
        };
        
    }
    
    return <section className="p-20 flex flex-col items-center">
        <figure className="flex justify-center  gap-5 flex-col pb-20 items-center">
            <img src={perfil} alt="" className="perfil w-[150px] h-[150px]" onClick={BuscarImagem}/>
            <FaImage size={18} className="absolute translate-x-16 translate-y-12"/>
            <input type="file" id="busca" className="hidden"/>
            <figcaption className="flex flex-col itens-center text-center gap-5">
                <h2 className="text-text-pargh">leovigildojaoa@gmail.com</h2>
                <h1 className="text-h2-title font-bold">Leovigildo João</h1>
            </figcaption>
        </figure>
       <div className="flex justify-center flex-col items-center">
       <SearchActividade title={"Minhas Actividades"}/>
        <SlidesActiviy/>
       </div>
        <div className="flex flex-col gap-5 max-w-[840px] w-full pt-20">
            <div className="flex flex-col gap-5 w-min whitespace-nowrap pt-20">
               <p className="hover:text-primary transition-all duration-300 cursor-pointer" onClick={OpenModalPerfil}> Editar perfil</p>
               <p className="hover:text-primary  transition-all duration-300 cursor-pointer" onClick={OpenModalSenha}> Editar senha</p>
                <Link><p className="hover:text-primary transition-all duration-300">Remover conta</p></Link>
                <Link><p className="hover:text-primary transition-all duration-300">Entre em contacto com a igreja</p></Link>
            </div>
        </div>
    </section>

}