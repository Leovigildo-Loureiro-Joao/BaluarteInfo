import { FaMessage, FaXmark } from "react-icons/fa6";
import { icone, activi, quemsomos } from "../../assets/Assets";
import { Galeria } from "../cards/Actividade/Galeria";
import { MinActive } from "../cards/Actividade/min-active";
import { useState } from "react";
import CommentInput from "../cards/Comentario/CommentInput";
import { CommentList } from "../cards/Comentario/gridComentario";



export const ModalActividade = ({ data, relacionados=[],closeModal }) => {
  const [showComments, setShowComments] = useState(false);

  return (

    <div className="bg-white w-screen  lg:max-w-[900px] min-h-[400px] bottom-0 absolute max-h-[90vh] rounded-xl flex flex-col gap-5 p-10 pt-5 overflow-y-auto">

      {/* Cabeçalho */}
      <div className="flex justify-between items-center w-full py-4 border-b">
        <div className="flex items-center gap-3">
          <img src={icone} alt="logo" className="w-14" />
          <h1 className="text-xl font-bold leading-tight">
            <span className="block font-light">Igreja</span>
            <span className="block text-2xl">Baluarte</span>
          </h1>
        </div>
        <button onClick={closeModal} className="text-gray-500 hover:text-primary transition">
          <FaXmark size={24} />
        </button>
      </div>

      {/* Imagem e Título */}
      <figure className="section-img relative w-full h-[300px] min-h-[300px]  rounded-xl overflow-hidden">
        <img src={data.img} alt={data.titulo} className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <figcaption className="absolute bottom-5 left-5 text-white text-3xl font-bold z-10">
          {data.titulo}
        </figcaption>
      </figure>

      {/* Frase Inspiradora */}
      <p className="italic text-center text-gray-600">
        "Participe com fé viva, em comunhão com os santos, louvando e adorando de alma rendida ao Senhor."
      </p>

      {/* Detalhes da Atividade */}
      <div className="flex flex-col gap-3 text-gray-800">
        <h2 className="text-primary text-2xl font-bold">Tema: {data.tema}</h2>
        <p><strong>Tipo de Evento:</strong> {data.tipoEvento}</p>
        <p><strong>Organizador:</strong> {data.organizador}</p>
        <p><strong>Data e hora:</strong> {data.dataEvento}</p>
        <p><strong>Descrição:</strong> {data.descricao}</p>
        <p><strong>Público-alvo:</strong> {data.publicoAlvo}</p>
      </div>

      {/* Ações */}
      <div className="flex gap-5 mt-4">
        <button className="buttonRectangle w-[150px]">Participar</button>
        <button className="buttonRectangle-white w-[150px]">Ver trailer</button>
      </div>

      {/* Comentários */}
    
<div className="mt-5 border-t pt-5">
  <button 
    onClick={() => setShowComments(!showComments)}
    className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
  >
    <FaMessage /> 
    {showComments ? 'Ocultar comentários' : `Ver comentários (${data.commentsCount || 0})`}
  </button>

  {showComments && (
    <div className="mt-4 animate-fadeIn">
      <CommentInput 
        onSubmit={(comment) => console.log('Novo comentário:', comment)} 
      />
      <CommentList comments={data.comments} />
    </div>
  )}
</div>

      {/* Galeria */}
      <Galeria />

      {/* Eventos semelhantes */}
      <div className="mb-10">
        <div className="text-h2-title sec py-5">
          <h1>Eventos semelhantes:</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
      </div>
    </div>
  );
};
