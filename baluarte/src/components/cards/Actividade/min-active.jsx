import { useNavigate } from "react-router-dom";
import { artigo } from "../../../assets/Assets";
import { ActiviComplete } from "./activeComplete";
import { MinActivyStyled } from "./Actividade.styled";

export const MinActive = ({titulo,descricao,img,dataSelect,id}) => {
    const nav=useNavigate()
    return (
        <MinActivyStyled className="activy-min flex flex-wrap flex-col min-h[400px]">
            <div id="capsula" className={`bg-no-repeat w-[20vw] min-w-[280px] max-h-[380px] h-screen bg-cover max-w-[350px] rounded-xl flex flex-col justify-end`} style={{backgroundImage :`url(${img})`}} >
                <div className="opacity-1 textoBox bg-black/80 relative mt-10 flex flex-col gap-5 rounded-xl ">
                    <div id="texto" className="p-10 flex flex-col gap-5">
                        <h2 className="text-white text-h2-title font-bold">{titulo}</h2>
                        <p className="text-white">
                            {descricao}
                        </p>
                    </div>
                    <button onClick={()=>{
                        nav("/Actividade/1")
                    }} className="text-white text-2xl p-5 hover:bg-primary rounded-b-lg hover:transition-all hover:duration-300 transition-all duration-300 ">Saber mais</button>
                </div>
            </div>
        </MinActivyStyled>
    );
}