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
        <section id="missao" className=" relative -top-10  h-full flex justify-center flex-col lg:py-40 md:py-20 py-10">
            <div className="flex flex-col md:flex-row justify-center items-center gap-10 px-4 py-8">
                <div className="bg-white/10 backdrop-blur p-10 rounded-xl shadow-xl max-w-2xl w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30">
                    <h2 className="text-2xl font-bold text-primary mb-4">Nossa Missão</h2>
                    <p className="text-black/70 leading-relaxed ">
                    A missão será colocada aqui pelo administrador. Ela precisa inspirar, informar e mobilizar.
                    </p>
                </div>
                <div className="bg-white/10 backdrop-blur p-10 rounded-xl shadow-xl max-w-2xl w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30">
                    <h2 className="text-2xl text-primary font-bold  sec mb-4">Nossa Visão</h2>
                    <p className="text-black/70 leading-relaxed">
                    A visão será colocada aqui pelo administrador. Pode incluir metas futuras ou direção espiritual.
                    </p>
                </div>
            </div>
        </section>
    );
};