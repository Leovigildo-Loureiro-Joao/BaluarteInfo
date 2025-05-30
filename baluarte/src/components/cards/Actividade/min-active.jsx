import { activi } from "../../../assets/Assets";
import { MinActivyStyled } from "./Actividade.styled";
import { useModal } from "../../Dialog/ModalContext";

export const MinActive = ({titulo,descricao,img,data,width=350}) => {
    const complete = {
        descricao: "Um encontro especial para refletirmos sobre a fé que move montanhas, com mensagens inspiradoras, louvor e oração em comunidade.",
        tema: "Fé em Tempos Difíceis",
        titulo: "Confia Mesmo no Vale",
        tipoEvento: "Culto Especial",
        publicoAlvo: "Famílias e jovens",
        organizador: "Norman & Equipe de Fé",
        dataEvento: "2025-11-15T19:30:00",
        contactos: "923456789",
        img: img // substitua `novaImg` pela imagem desejada
    }
    
     const { openModal } = useModal();
        function OpenModal() {
            openModal("modalActividade", {
                data: complete
            })
        }
    return (
        <MinActivyStyled className="activy-min w-full h-full flex flex-wrap flex-col ">
            <div id="capsula" className={`bg-no-repeat h-auto w-full min-w-[180px] min-h-[350px] bg-cover rounded-xl flex flex-col justify-end`} style={{backgroundImage :`url(${img})`}} >
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