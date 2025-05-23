import { useNavigate } from "react-router-dom";
import { activi, artigo } from "../../../assets/Assets";
import { ActiviComplete } from "./activeComplete";
import { MinActivyStyled } from "./Actividade.styled";
import { useModal } from "../../Dialog/ModalContext";

export const MinActive = ({titulo,descricao,img,data,width=350}) => {
    const nav=useNavigate()
    const complete={
        descricao:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure est adipisci consequuntur ipsam rerum, saepe id ratione molestiae architecto velit sit tempore debitis tempora vitae laudantium praesentium earum pariatur aliquid.",
        tema:"Envangelho",
        titulo:"Não perca a esperança  ",
        tipoEvento:"Envagelismo",
        publicoAlvo:"Todos",
        Organizador:"Leovigildo",
        dataEvento:"2025-12-02T02:00:00",
        contactos:"955383237",
        img:activi
    }
     const { openModal } = useModal();
        function OpenModal() {
            openModal("modalActividade", {
                data: complete
            })
        }
    return (
        <MinActivyStyled className="activy-min  flex flex-wrap flex-col ">
            <div id="capsula" className={`bg-no-repeat w-full min-w-[180px] max-w-[350px] max-h-[${width}px] min-h-[220px] h-full bg-cover rounded-xl flex flex-col justify-end`} style={{backgroundImage :`url(${img})`}} >
                <div className="opacity-1 textoBox bg-black/80 relative mt-10 flex flex-col gap-5 rounded-xl ">
                    <div id="texto" className="p-10 flex flex-col gap-5">
                        <h2 className="text-white text-h2-title font-bold">{titulo}</h2>
                        <h2 className="text-white text-xl font-bold">{data}</h2>
                        <p className="text-white">
                            {descricao}
                        </p>
                    </div>
                    <button onClick={OpenModal} className="text-white text-2xl p-5 hover:bg-primary rounded-b-lg hover:transition-all hover:duration-300 transition-all duration-300 ">Saber mais</button>
                </div>
            </div>
        </MinActivyStyled>
    );
}