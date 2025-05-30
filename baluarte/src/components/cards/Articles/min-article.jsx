import { useModal } from "../../Dialog/ModalContext";

export const MinArticle=({titulo,descricao,img,tipo="Devocional"})=>{
      const complete={
            descricao:descricao,
            titulo:titulo,
            tipo:tipo,
            escritor:"Leovigildo",
            img:img,
            npag: 12
        };

   

        const relacionados=[
                { titulo: "Luz no Caminho", escritor: "Pr. João", tipo: "Devocional" },
                { titulo: "O Verbo se fez Carne", escritor: "Ir. Maria", tipo: "Comentário" },
                { titulo: "Verdade que Liberta", escritor: "Ev. Paulo", tipo: "Estudo" }
            ];


         const { openModal } = useModal();
            function OpenModal() {
                openModal("modalArtigo", {
                    data: complete,
                    relacionados: relacionados
                })
            }
    return <article className="artigo flex flex-col w-[300px] shadow-black/20 shadow-md rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30">
        <figure className="section-img rounded-b-[0]">
            <img src={img} alt="" className="rounded-t-xl cursor-pointer h-[200px] object-cover w-[400px]"/>
        </figure>
        <div>
        <div className="px-10 py-5 flex gap-2 flex-col h-[150px]">
            <h2 className="text-black text-li-nav font-bold">{titulo}</h2>
            <h2 className="text-black text-text-pargh font-bold">{tipo}</h2>
            <div className="relative overflow-hidden max-h-[60px]">
                <p className="text-black overflow-y-auto pr-2 custom-scrollbar">{descricao}</p>
                <div className="absolute bottom-0 left-0 w-full h-5 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>
        </div>
            <div className="flex">
                <button  onClick={OpenModal} className="buttonRectangle artcle">Saber mais</button>
                <button className="buttonRectangle-white artcle">Baixar</button>
            </div>
        </div>
    </article>
}