import { quemsomos } from "../assets/Assets"

export const QuemSomos=()=>{
   return <>
           <section id="quemsomos" className="px-40 flex py-32">
               <div className="flex flex-col w-1/2">
                   <div className="h2-title sec">
                       <h1>Quem somos</h1>
                       <span></span>
                   </div>
                   <div className=" gap-10 flex flex-col">
                       <p >Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur doloribus cupiditate sit fugit facilis, incidunt possimus reiciendis laboriosam molestias et deserunt obcaecati saepe quam commodi, minus tempora id minima expedita!
                           <br/> <br/>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, incidunt debitis aut quaerat ratione, et commodi pariatur repudiandae recusandae quas, animi autem explicabo veritatis ducimus atque! Magni dolore voluptatibus quaerat.
                       </p>
                   </div>
   
               </div>
               <figure className="ml-[10%] w-2/5">
                   <img src={quemsomos} alt="" />
               </figure>
           </section>
       </>
}