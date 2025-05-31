import { useState } from "react";
import { icone, perfil } from "../../assets/Assets";
import { Link } from "react-router-dom";
import Navbar from "./NavBar";

export const Header = () => {
  return (
    <section className="relative bg-cover z-10 bg-center h-[20rem] md:h-[28rem] bg-fundo-baluarte">
      <div className="absolute z-0 inset-0 bg-sombra-vermelha/40"></div>
      <div className="z-10 relative flex flex-col">
        <div className="flex flex-col lg:flex-row justify-between px-5 py-5 md:px-20 md:py-10 lg:py-20 gap-5 md:gap-10">
          {/* Left block - Logo and Church name */}
          <div className="flex flex-row items-center gap-3 md:gap-4">
            <img 
              src={icone} 
              className="w-14 md:w-20 lg:w-28 transition-all duration-300" 
              alt="Ícone da Igreja Baluarte" 
            />
            <h1 className="leading-tight">
              <span className="text-white text-2xl md:text-3xl lg:text-4xl font-thin">Igreja</span><br />
              <span className="text-white text-4xl md:text-5xl lg:text-6xl font-semibold">Baluarte</span>
            </h1>
          </div>

          {/* Right block - Profile and verse */}
          <div className="flex flex-col items-end">
            <figure className="flex justify-end">
              <Link to="/Perfil/1">
                <img 
                  src={perfil} 
                  className="w-10 h-10 md:w-12 md:h-12 lg:w-[50px] lg:h-[50px] rounded-full transition-all duration-300 hover:ring-2 hover:ring-white/50" 
                  alt="Foto de perfil" 
                />
              </Link>
            </figure>
            <h2 className="md:text-subtitle text-[1.7rem] text-end text-white py-2 md:py-4 ">Salmos 23:1</h2>
            <p className="md:text-li-nav text-base text-end text-white  italic">
              "O Senhor é o meu pastor, nada me faltará."
            </p>
          </div>
        </div>
        <Navbar />
      </div>
    </section>
  );
};