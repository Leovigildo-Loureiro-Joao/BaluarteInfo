import { LiaTruckMovingSolid } from "react-icons/lia";
import { activi, icone, quemsomos } from "../../assets/Assets";
import { Galeria } from "../cards/Actividade/Galeria";
import { MinActive } from "../cards/Actividade/min-active";
import { SlidesActiviy } from "../cards/Actividade/slides-active";
import { FaFilm, FaMessage, FaXmark } from "react-icons/fa6";
import { Retrato_Article } from "../cards/Articles/retrato_article";
        
        
import { Download } from "lucide-react";

export default function ModalArtigo({ data, relacionados,closeModal }) {
  return (
    <div className="bg-white  w-screen lg:w-[90vw]  max-w-[1000px] min-h-[400px] max-h-[90vh] lg:max-h-[80vh] bottom-0 lg:bottom-auto rounded-xl flex flex-col gap-5 p-10 pt-0 absolute">
        {/* HEADER */}
      <div className="flex lg:pr-12 mt-5 bg-white w-full z-50 pr-0 lg:max-w-[1000px] max-h-[80px] h-full items-center justify-between">
        <div className="flex items-center bg-white">
          <img src={icone} alt="Logo" className="w-10 lg:w-20" />
          <h1>
            <span className="font-thin text-xl lg:text-2xl">Igreja</span>
            <br />
            <span className="text-2xl lg:text-4xl font-semibold">Baluarte</span>
          </h1>
        </div>
       <div className="flex items-center gap-10">
       <p className="text-center text-gray-500 italic hidden lg:block hidden">
        "Fortalecendo vidas com fé, verdade e conhecimento."
      </p>
        <button onClick={closeModal} className=" text-gray-500 hover:text-primary transition-all duration-300"><FaXmark size={24}/></button>
       </div>
      </div>


      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex lg:p-5 p-0 gap-10 mt-5 flex-col lg:flex-row overflow-y-scroll">
        {/* Imagem */}
        <figure className="w-full lg:w-[250px] max-h-[410px] hidden lg:block section-img">
          <img
            src={data.img}
            alt=""
            className="rounded-xl cursor-pointer h-[400px] object-cover w-full"
          />
        </figure>

        {/* Texto */}
        <div className="h-[400px] flex flex-col gap-8 lg:w-[60%]">
          <div className="flex flex-col gap-2">
            <h2 className="text-h2-title-big font-bold">{data.titulo}</h2>
            <p>{data.descricao}</p>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <h3 className="text-black">
              <strong className="text-primary">Quantidade de páginas:</strong> {data.npag}
            </h3>
            <h3 className="text-black">
              <strong className="text-primary">Escritor:</strong> {data.escritor}
            </h3>
            <h3 className="text-black">
              <strong className="text-primary">Tipo de artigo:</strong> {data.tipo}
            </h3>
          </div>

          {/* Botão de Download */}
          <button
            className="buttonRectangle-white flex-row w-[160px] flex items-center justify-center gap-2 "
            onClick={() => window.open(`/api/artigos/download/${data.id}`)}
          >
            <Download className="w-5 h-5" />
           <p> Baixar PDF</p>
          </button>
        </div>

        {/* Artigos Relacionados */}
        <aside className="hidden lg:flex flex-col w-[250px] gap-4 overflow-y-auto h-[400px] border-l pl-4">
          <h4 className="text-xl font-semibold text-primary">Relacionados</h4>
          {relacionados.map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 p-3 rounded-lg shadow hover:shadow-lg cursor-pointer transition-all"
              onClick={() => console.log("Selecionado:", item.titulo)}
            >
              <h5 className="font-bold text-md">{item.titulo}</h5>
              <p className="text-sm text-gray-600">por {item.escritor}</p>
              <span className="text-xs text-primary">{item.tipo}</span>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
