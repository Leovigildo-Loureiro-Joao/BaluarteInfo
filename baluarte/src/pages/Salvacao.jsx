import { salvacao } from "../assets/Assets"

export const Salvacao=()=>{
    return <>
        <section  className=" flex flex-col-reverse 
    md:flex-row
    px-4 sm:px-10 md:px-16 lg:px-24 
    py-10 sm:py-20 lg:py-32
    gap-10">
            <div className="flex flex-col w-full md:w-1/2">
                <div className="h2-title sec">
                    <h1>Salvação hoje</h1>
                    <span></span>
                </div>
                <div className=" gap-10 flex flex-col">
                    <p >Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur doloribus cupiditate sit fugit facilis, incidunt possimus reiciendis laboriosam molestias et deserunt obcaecati saepe quam commodi, minus tempora id minima expedita!
                        <br/> <br/>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, incidunt debitis aut quaerat ratione, et commodi pariatur repudiandae recusandae quas, animi autem explicabo veritatis ducimus atque! Magni dolore voluptatibus quaerat.
                    </p>
                </div>

            </div>
            <figure className="ml-0 md:ml-[10%] w-full md:w-2/5 section-img">
                <img src={salvacao} alt="" />
            </figure>
        </section>
    </>
}