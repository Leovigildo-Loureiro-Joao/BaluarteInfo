
export const Retrato_Article=({titulo,descricao,img})=>{
    return <>
        <article className="w-[600px] flex bg-secondary rounded-xl shadow-md p-10 shadow-black/30">
        <figure className="w-[250px]">
            
            <img src={img} alt="" className="rounded-xl cursor-pointer h-[400px] object-cover w-[250px]"/>
        </figure>
        <div className="h-[400px] flex flex-col">
            <div className="px-10 py-5 flex gap-2 flex-col h-[90%] w-[300px]">
                <h2 className="text-h2-title-big font-bold">{titulo}</h2>
                <p>{descricao}</p>
                <div className="flex gap-5 flex-col mt-5">
                    <h3 className="text-black"><strong className="text-primary">Quantidade de paginas :</strong> {"5"}</h3>
                    <h3 className="text-black"><strong className="text-primary">Escritor: </strong> {"Thomoson Arthur"}</h3>
                    <h3 className="text-black"><strong className="text-primary">Publico Alvo: </strong> {"Todos"}</h3>
                </div>
 
            </div>
            <div className="flex gap-10 px-10" >
                <button className="buttonRectangle w-[120px]">Saber mais</button>
                <button className="buttonRectangle-white w-[120px]">Baixar</button>
            </div>
        </div>
        </article>
    </>
}