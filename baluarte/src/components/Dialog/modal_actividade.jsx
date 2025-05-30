import { FaMessage, FaXmark } from "react-icons/fa6";
import { icone, activi, quemsomos } from "../../assets/Assets";
import { Galeria } from "../cards/Actividade/Galeria";
import { MinActive } from "../cards/Actividade/min-active";



export const ModalActividade = ({ data, closeModal }) => {
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
      <p className="cursor-pointer mt-5 transition-all duration-100 hover:text-primary flex gap-2 items-center">
        <FaMessage /> Ver comentários (10)
      </p>

      {/* Galeria */}
      <Galeria />

      {/* Eventos semelhantes */}
      <div className="mb-10">
        <div className="h2-title sec py-5">
          <h1>Eventos semelhantes:</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MinActive
            width={200}
            titulo={"Evangelho!!!"}
            data={"Domingo, 23 Jun – 19h"}
            img={activi}
            descricao={"Exemplo de descrição de evento."}
          />
          <MinActive
            width={200}
            titulo={"Evangelho!!!"}
            data={"Domingo, 23 Jun – 19h"}
            img={quemsomos}
            descricao={"Exemplo de descrição de evento."}
          />
          <MinActive
            width={200}
            titulo={"Evangelho!!!"}
            data={"Domingo, 23 Jun – 19h"}
            img={quemsomos}
            descricao={"Exemplo de descrição de evento."}
          />
        </div>
      </div>
    </div>
  );
};
