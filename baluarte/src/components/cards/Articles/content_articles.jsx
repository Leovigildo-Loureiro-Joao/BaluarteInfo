import { LiaArrowAltCircleLeft, LiaArrowAltCircleRight } from "react-icons/lia"
import { SlideArticle } from "./slideArticle"
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { RxArrowLeft, RxArrowRight, RxChevronLeft, RxChevronRight } from "react-icons/rx"
import { useState } from "react"
import { Link } from "react-router-dom"

export const ContentArticle=()=>{
    const [pos,setPos]=useState(0)
    function Volta() {
        setPos((val)=> val-1)
    }

    function Proximo() {
        setPos((val)=> val+1)
    }
    return <>
       <section className="px-10 md:px-20 lg:px-32 xl:px-40 py-10 flex flex-col justify-center items-center">

            <div className="h2-title lg:max-w-[590px] w-full my-0 flex flex-row justify-between items-center">
                <h1>Nossos novos Artigos</h1>
                <Link to={"/Artigos"}><button className="buttonRectangle px-10" >Ver mais artigos</button></Link>
            </div>
          
            <div className="my-10 lg:max-w-[685px] w-full flex items-center gap-5">
                <RxChevronLeft  className=" lg:block hidden text-5xl text-primary/50 cursor-pointer relative -top-20" onClick={Volta}/>
                <SlideArticle index={pos}/>
                <RxChevronRight className="lg:block hidden text-5xl text-primary/50 cursor-pointer relative -top-20" onClick={Proximo}/>
            </div>

        </section>
    </>
}