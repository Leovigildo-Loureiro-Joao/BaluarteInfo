import { BiPointer } from "react-icons/bi"
import { LiaEye, LiaFacebook, LiaShareSolid, LiaShareSquare } from "react-icons/lia"

export const MinArticle=({titulo,descricao,img})=>{
    return <article className="artigo flex flex-col w-[300px] shadow-black/20 shadow-md rounded-xl">
        <figure className="">
            <img src={img} alt="" className="rounded-t-xl cursor-pointer h-[200px] object-cover w-[400px]"/>
        </figure>
        <div>
            <div className="px-10 py-5 flex gap-2 flex-col h-[150px]">
                <h2 className="text-black text-li-nav font-bold">{titulo}</h2>
                <p className="text-black">{descricao}</p>
            </div>
            <div className="flex">
                <button className="buttonRectangle artcle">Saber mais</button>
                <button className="buttonRectangle-white artcle">Baixar</button>
            </div>
        </div>
    </article>
}