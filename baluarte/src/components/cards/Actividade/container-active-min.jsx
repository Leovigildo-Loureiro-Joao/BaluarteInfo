import { Actividade } from "../../../pages/Actividade";

export const Actividade_Content=({data})=>{
    
    return <>
           <section id="actividades" className="px-20">
            <div className="h2-title sec">
                <h1>Actividades em destaque</h1>
                <span></span>
            </div>
           <Actividade/>
       </section>
       </>
}