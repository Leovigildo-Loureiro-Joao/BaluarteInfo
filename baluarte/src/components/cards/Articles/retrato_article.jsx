
export const Retrato_Article=({titulo,descricao,img,escritor="Thomas Thomson",npag="5",tipo="Devocional"})=>{
    return <>
        <article className=" lg:min-w-[600px] flex-shrink-0 lg:max-w-screen-md w-full flex bg-secondary rounded-xl shadow-md p-10 shadow-black/30">
        <figure className="w-1/3 section-img lg:block hidden">
            
            <img src={img} alt="" className="rounded-xl cursor-pointer h-[400px] object-cover w-[250px]"/>
        </figure>
        <div className="h-[400px] flex flex-col lg:w-2/3 w-full ">
            <div className="px-10 py-5 flex gap-2 flex-col h-[90%] ">
                <h2 className="text-h2-title-big font-bold">{titulo}</h2>
                <p>{descricao}</p>
                <div className="flex gap-5 flex-col mt-5">
                    <h3 className="text-black"><strong className="text-primary">Quantidade de paginas :</strong> {npag}</h3>
                    <h3 className="text-black"><strong className="text-primary">Escritor: </strong> {escritor}</h3>
                    <h3 className="text-black"><strong className="text-primary">Tipo de artigo: </strong> {tipo}</h3>

                </div>
 
            </div>
            <div className="flex gap-10 px-10" >
                <button className="buttonRectangle-white w-[120px]">Baixar</button>
            </div>
        </div>
        </article>
    </>
}