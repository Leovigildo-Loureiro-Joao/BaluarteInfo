import { useState } from "react";
import { artigo, music, quemsomos } from "../assets/Assets"
import { Actividade_Content } from "../components/cards/Actividade/container-active-min"
import { SlidesActiviyMin } from "../components/cards/Actividade/slides-active";
import { ContentArticle } from "../components/cards/Articles/content_articles";
import { ContentAudios } from "../components/cards/Audios/content_audios";
import { Missao } from "../components/cards/Missao/Missao"
import { ContentVideo } from "../components/cards/Videos/content_videos";
import { ListItem } from "../components/items-list/ListItem";
import { useModal } from "../components/Dialog/ModalContext";
import { Link } from "react-router-dom";

export const Home=()=>{
    const [select,setSelect]=useState(0);
    const frazes=["<strong>Proclamar o amor</strong> transformador de Cristo, restaurando vidas, fortalecendo famílias e formando discípulos cheios do <Forte>Espírito</Forte>, para impactar o mundo com fé, <Forte>esperança e justiça</Forte>.",
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit eligendi unde saepe voluptate corporis quibusdam optio autem cupiditate, dolore cum id maxime doloremque quos veniam culpa dicta. Mollitia, autem velit.",
        "Ola vida ipsum dolor sit amet consectetur adipisicing elit. Iste fuga corrupti, impedit ullam labore molestias cum sit vero consequatur necessitatibus atque laboriosam, eum ab commodi eligendi nam sed itaque debitis."];
    return <>
<section
  id="quemsomos"
  className="
    flex flex-col-reverse 
    md:flex-row
    px-4 sm:px-10 md:px-16 lg:px-24 
    py-10 sm:py-20 lg:py-32
    gap-10
  "
>
    <div className="flex flex-col w-full md:w-1/2">
        <div className="h2-title sec">
            <h1>Quem somos</h1>
            <span></span>
        </div>
        <div className="gap-10 flex flex-col">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur doloribus cupiditate sit fugit facilis, incidunt possimus reiciendis laboriosam molestias et deserunt obcaecati saepe quam commodi, minus tempora id minima expedita!
                <br /> <br />Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, incidunt debitis aut quaerat ratione, et commodi pariatur repudiandae recusandae quas, animi autem explicabo veritatis ducimus atque! Magni dolore voluptatibus quaerat.
            </p>
            <div className="flex justify-center">
                <Link to={"/QuemSomos"}>
                    <button className="buttonRectangle min">Saber mais</button>
                </Link>
            </div>
        </div>
    </div>
    <figure className="ml-0 md:ml-[10%] w-full md:w-2/5 section-img">
        <img src={quemsomos} alt="" />
    </figure>
</section>

        <Missao frazes={frazes}/>
        <div className="mt-10 flex flex-col justify-center items-center">
            <div className="h2-title sec flex flex-col font-extrabold">
                <h1>Actividades</h1>
             
            </div>
            <SlidesActiviyMin/>
        </div>
        <ContentArticle/>
        <section className="pb-40 xl:px-52 lg:px-20 px-10">
           
            <section className="flex justify-center flex-col items-center">
                <nav className="flex max-w-[990px] w-full justify-start pb-5 -ml-5">
                    <ul className="flex w-1/2 gap-5 tema">
                        <ListItem text={"Audios"} classe={select==0?"selected":""} setValue={setSelect} value={0} />
                        <ListItem text={"Videos"} classe={select==1?"selected":""} setValue={setSelect} value={1}/>     
                    </ul>
                </nav>
                <section className="w-full max-w-[990px] overflow-hidden  ">
                    <section className="flex transition-transform duration-500 ease-in-out flex-shrink-0" style={{
                                   transform: `translateX(-${select * 100}%)`,
                                    transition: "transform 0.5s ease-in-out"
                                }}>
                        <ContentAudios/>
                        <ContentVideo/>
                    </section>
                </section>
               
            </section>
            
            
        </section>
    </>
}