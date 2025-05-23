import { LiaTruckMovingSolid } from "react-icons/lia";
import { activi, icone, quemsomos } from "../../assets/Assets";
import { Galeria } from "../cards/Actividade/Galeria";
import { MinActive } from "../cards/Actividade/min-active";
import { SlidesActiviy } from "../cards/Actividade/slides-active";
import { FaFilm, FaMessage } from "react-icons/fa6";

export const ModalActividade=({data,closeModal})=>{
    return (
        
            <div className="bg-white w-[90vw] max-w-[900px] min-h-[400px] max-h-[550px] rounded-xl flex flex-col gap-5 p-10 pt-0 overflow-scroll">
                <div className="flex pr-12 bg-white w-full z-50 max-w-[855px] h-[80px] items-center justify-between fixed">
                    <div className=" flex items-center  bg-white">
                        <img src={icone} alt=""  className="w-20"/>
                        <h1>
                            <span className="font-thin text-2xl">Igreja</span>
                            <br/>
                            <span className="text-4xl font-semibold">Baluarte</span>
                        </h1>
                    </div>
                    <h1 className="text-subtitle font-bold ">{data.titulo}</h1>
                </div>
                <div className="p-7 pt-40">
                    <article className="grid grid-cols-2 gap-10 h-auto">
                        <div className="w-[55vw] flex flex-col gap-5 ">
                        
                            <h2 className="text-primary text-h2-title font-semibold"><strong>Tema:</strong> {data.tema}</h2>
                            <h3 className="text-primary text-text-pargh font-semibold"><strong>Tipo de Evento:</strong> {data.tipoEvento}</h3>
                            <h3><strong>Organizador: </strong>{data.Organizdor}</h3>
                            <h3><strong>Data e hora: </strong>{data.dataEvento}</h3>
                            <div className="max-w-[300px]">
                                <h3><strong>Descricao</strong></h3>
                                <p>{data.descricao}</p>
                            </div>
                            <h3><strong>Publico alvo:</strong> {data.publicoAlvo}</h3>
                            <div className="flex gap-5">
                                <button className="flex buttonRectangle w-[150px]">Participar</button>
                                <button className=" flex buttonRectangle-white w-[150px]"> Ver trailer</button>
                            </div>
                            <p className="cursor-pointer mt-5 transition-all duration-100 hover:text-primary flex gap-5 items-center" > <FaMessage /> Ver comentários (10)</p>
                        </div>
                        <figure className="w-full max-w-[1000px] flex flex-col gap-10 section-img">
                            <img src={data.img} alt="" className="rounded-xl object-cover h-[300px] w-[50vw] max-w-[500px]"/>
                        </figure>
                    </article>
                    <Galeria/>
                    <div className="mb-20">
                        <div className="h2-title sec py-5">
                            <h1>Eventos semelhantes: </h1>
                        </div>
                         <div className="grid grid-cols-3 gap-10 w-full max-w-[900px]">
                            <MinActive width={200} titulo={"Envangelho!!!"} data={"Domingo, 23 Jun – 19h  "} img={activi} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                            <MinActive width={200} titulo={"Envangelho!!!"} data={"Domingo, 23 Jun – 19h  "} img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                            <MinActive width={200} titulo={"Envangelho!!!"} data={"Domingo, 23 Jun – 19h  "}  img={quemsomos} descricao={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias quae debitis quas modi amet quaerat tempore, quis nihil nulla placeat a expedita dolores dicta excepturi dolore dolorum veniam ducimus magni!"}/>
                        </div>
                    </div>
                </div>
            
            </div>
       
    );
}