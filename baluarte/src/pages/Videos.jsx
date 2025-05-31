
import { LiaSearchSolid } from "react-icons/lia"
import { GridVideos } from "../components/cards/Videos/GridVideos"
import { FaVideo } from "react-icons/fa6"
import { Select } from "../components/select/Select"

export const Videos=()=>{
        return <>
            <section className="xl:m-32 m-10 flex flex-col items-center">
                <div className="h2-title sec w-min">
                    <h1>Videos</h1>
                </div>
            <div className="gap-10 flex pb-32 ">
                <div className="flex items-center w-[60vw] max-w-[730px]">
                    <input type="text" placeholder="Pesquisar videos" name="" id="" className=" w-full h-16 pl-10 rounded-lg border-solid border border-gray-950/50 outline-0"/>
                    <LiaSearchSolid className="relative -left-16" size={"2rem"}/>
                </div>
                {/* <Select vect={["Todos Videos"," Cultos Gravados","Palavra da Semana","Ministrações Especiais","Doutrinário","Testemunho","Apologética","Profético","Teológico"]} icon={FaVideo}/> */}
                 <Select vect={["Todos Videos"," Cultos Gravados","Palavra da Semana","Ministrações Especiais","Momentos de Louvor","Conferências/Eventos","Série Doutrinária / Ensino"]} icon={FaVideo}/>
            </div>
            <div className="flex justify-center flex-col items-center">
                <GridVideos />
            </div>
               
            </section>
           
        </>
}