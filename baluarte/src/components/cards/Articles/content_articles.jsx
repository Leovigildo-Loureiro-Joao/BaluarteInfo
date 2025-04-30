import { LiaArrowAltCircleLeft, LiaArrowAltCircleRight } from "react-icons/lia"
import { SlideArticle } from "./slideArticle"
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { RxArrowLeft, RxArrowRight } from "react-icons/rx"
import { useState } from "react"

export const ContentArticle=()=>{
    const [pos,setPos]=useState(0)
    function Volta() {
        setPos((val)=> val-1)
    }

    function Proximo() {
        setPos((val)=> val+1)
    }
    return <>
        <section className="p-40 flex flex-col jjustify-center items-center">
            <div className="h2-title w-[590px] my-0 flex flex-row justify-between items-center">
                <h1>Nossos novos Artigos</h1>
                <button className="buttonRectangle px-10">Ver mais artigos</button>
            </div>
            <div>

            </div>
            <div className="my-10  w-[685px] flex items-center gap-5">
                <RxArrowLeft  className="text-4xl text-primary/50 cursor-pointer" onClick={Volta}/>
                <SlideArticle index={pos}/>
                <RxArrowRight className="text-4xl text-primary/50 cursor-pointer" onClick={Proximo}/>
            </div>

        </section>
    </>
}