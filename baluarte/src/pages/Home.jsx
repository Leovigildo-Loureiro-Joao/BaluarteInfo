import { bottomWave, quemsomos, topWave } from "../assets/Assets"
import { MinActive } from "../components/cards/Actividade/min-active"

export const Home=()=>{
    return <>
       <section className="px-20 flex py-20">
            <div className="flex flex-col">
                <div className="h2-title sec">
                    <h1>Quem somos</h1>
                    <span></span>
                </div>
                <div className="w-3/4 gap-10 flex flex-col">
                    <p >Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur doloribus cupiditate sit fugit facilis, incidunt possimus reiciendis laboriosam molestias et deserunt obcaecati saepe quam commodi, minus tempora id minima expedita!</p>
                    <div className="flex justify-center"><button className="buttonRectangle min">Saber mais</button></div>
                </div>
            </div>
            <figure>
                <img src={quemsomos} alt="" />
            </figure>
       </section>

       <section className="mb-[80vh]">
            <figure className="absolute w-screen">
                <img src={topWave} alt="" />
                <img src={bottomWave} alt="" />
            </figure>
            <div className="px-20 relative z-10 flex flex-col justify-center items-center top-44">
                <div className="h2-title sec ">
                    <h1 >Missão e Visão</h1>
                </div>
                <div >
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur doloribus cupiditate sit fugit facilis, incidunt possimus reiciendis laboriosam molestias et deserunt obcaecati saepe quam commodi, minus tempora id minima expedita!</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt molestiae nisi esse dicta fuga enim molestias explicabo rerum minus at. Iusto necessitatibus, assumenda aliquam pariatur sint dolore laboriosam unde asperiores.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem debitis vel temporibus tenetur quis impedit fugiat quibusdam nostrum ipsam dolorum voluptatibus id cum labore optio nam ab accusamus, dolore aspernatur!</p>
                </div>
                <div>
                    <i></i> <i></i> <i></i>
                </div>
            </div>
            
       </section>

       <section className="px-20">
            <div>
                <h1>Actividades em destaque</h1>
                <span></span>
            </div>
            <div>
                <nav>
                    <ul>
                        <li><p>Anual</p><span></span></li>
                        <li><p>Mensal</p><span></span></li>
                        <li><p>Projecto</p><span></span></li>
                    </ul>
                </nav>
            <div>
                <div>
                    <MinActive/>
                </div>
                <div>
                    <article>
                        
                    </article>
                </div>
                <div>
                    <article>
                        
                    </article>
                </div>
            </div>
            </div>
            
       </section>

    </>
}