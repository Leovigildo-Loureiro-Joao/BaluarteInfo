import { BiPointer } from "react-icons/bi"
import { LiaEye, LiaFacebook, LiaShareSolid, LiaShareSquare } from "react-icons/lia"

export const MinArticle=({titulo,descricao,img})=>{
    return <article className="artigo flex flex-col w-[300px]">
        <figure>
            <div className=" rounded-t-xl bg-black/60 flex gap-10 justify-center items-center absolute h-[200px] w-[300px] opacity-0">
                <LiaEye  className="text-white cursor-pointer hover:text-primary transition-all duration-300" size={20}/>
                <LiaShareSquare  className="text-white cursor-pointer hover:text-primary transition-all duration-300" size={20}/>
            </div>
            <img src={img} alt="" className="rounded-t-xl cursor-pointer h-[200px] object-cover w-[400px]"/>
        </figure>
        <div className="bg-black px-10 py-5 flex gap-2 flex-col h-[150px]">
            <h2 className="text-white text-li-nav font-bold">{titulo}</h2>
            <p className="text-white">{descricao}</p>
        </div>
        <div className="flex">
            <button className="buttonRectangle artcle">Saber mais</button>
            <button className="buttonRectangle-white artcle">Baixar</button>
        </div>
    </article>
}