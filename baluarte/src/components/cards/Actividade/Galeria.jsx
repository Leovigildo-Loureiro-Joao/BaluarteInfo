import { useEffect, useState } from "react"
import { activi, artigo, quemsomos } from "../../../assets/Assets"


export const Galeria=()=>{

    const [vectImage,setVectImage]=useState([quemsomos,quemsomos,activi,artigo,activi,])
    const [sel,setSel]=useState(1)

    useEffect(()=>{
        const interval=setInterval(() => {
            setSel(select=>{
                const selector=select==vectImage.length?0:(select + 1) % vectImage.length
                return selector;
            })
        }, 10000);
        return () => clearInterval(interval);
    },[vectImage.length])


    return   <div>
    <div>
        <div className="h2-title sec">
            <h1>Galeria de fotos</h1>
            <span></span>
        </div>
        <p className="w-[55%] mb-10">
            Reviva os momentos especiais das nossas atividades através da nossa galeria! 
            Aqui você encontrará imagens inspiradoras que capturam a essência de cada evento, 
            desde momentos de oração e louvor até comunhão e celebração. 
            Deixe-se envolver pela atmosfera única de cada encontro e prepare-se para participar
            das próximas experiências!
        </p>
    </div>
    <section className="flex flex-col justify-center items-center">
        <div id="boxGaleria" className="w-[850px] overflow-hidden  h-[550px]" style={{}} >
            <div className="flex gap-10 mt-10 w-auto items-center" >
                {
                    vectImage.map((value,i)=>{
                        return <figure key={i} className={"relative rect-image"+(i==sel?" selected":"")} style={{
                            animation:"autoRun 10s linear infinite delay(-500)",
                        }}>
                        <img src={value} alt="" />
                    </figure>
                    })
                }
            </div>
        </div>
        <div id="painel-corresel" className="flex gap-2 mt-4">
            {vectImage.map((v, o) => (
                <i 
                    key={o} 
                    className={`w-3 h-3 rounded-full ${(o==sel?"selected":"")}`}
                ></i>
            ))}
        </div>
    </section>
</div>
}