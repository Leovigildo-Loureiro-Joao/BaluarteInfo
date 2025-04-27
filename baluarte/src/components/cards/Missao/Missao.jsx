import { useEffect, useState } from "react";
import { Forte } from "../../letter/Letter.styled";

export const Missao = ({ frazes = [] }) => {
    const [cont, setCont] = useState(0);
    const [select, setSelect] = useState(Array(frazes.length).fill(""));
    
    function Selecionar() {
        setCont(prev => {
            const next = (prev + 1) % frazes.length;
            // Atualiza os indicadores
            const newSelect = Array(frazes.length).fill("");
            newSelect[next] = "selected";
            setSelect(newSelect);
            return next;
        });
    }

    useEffect(() => {
        Selecionar()
        const interval = setInterval(() => {
            Selecionar()
        }, 3000);
        
        return () => clearInterval(interval);
    }, [frazes.length]);
    
    return (
        <section id="missao" className=" bg-no-repeat bg-cover h-full flex justify-center flex-col py-40 w-screen">
            <div className="px-20 relative -top-10 z-10 flex flex-col justify-center items-center w-screen">
                <div className="h2-title sec">
                    <h1>Missão e Visão</h1>
                </div>
                <div className="flex w-11/12 overflow-hidden relative h-40">
                    <div 
                        id="carrosel" 
                        className="flex w-screen absolute pl-20 gap-[30vw]" 
                        style={{
                            transform: `translateX(-${cont * 100}%)`,
                            transition: "transform 0.5s ease-in-out"
                        }}
                    >
                        {frazes.map((value, o) => (
                            <div key={o} className={`${select[o]} w-[70vw]`}>
                                <p dangerouslySetInnerHTML={{ __html: value }}/>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div id="painel-corresel" className="flex gap-2 mt-4">
                    {frazes.map((_, o) => (
                        <i 
                            key={o} 
                            className={`w-3 h-3 rounded-full ${select[o]}`}
                        ></i>
                    ))}
                </div>
            </div>
        </section>
    );
};