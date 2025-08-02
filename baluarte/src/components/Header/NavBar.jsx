import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [select, setSelect] = useState(["", "", "", "", ""]); 
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="flex flex-col gap-5 lg:items-end justify-start px-20 relative -top-5">
         <button className={"lg:hidden "+(open?"text-black fixed  z-50 top-10 left-20":"text-white")} onClick={() => setOpen(!open)}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
                <path strokeLinecap="round" className=" transition-all duration-300" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
                <path strokeLinecap="round" className="transition-all duration-300" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            )}
            </svg>
      </button>

     

      {/* Menu com dropdown */}
    <ul className={`${open ? 'flex justify-center items-center gap-5 lg:gap-10 flex-col bg-white text-primary z-30 backdrop-blur-sm fixed lg:h-auto h-screen w-screen top-0 left-0' : 'hidden lg:flex gap-10 '}`}>

      <Link to="/">
        <li
          onClick={() => { setSelect(["selected", "", "", "", ""]); setDropdownOpen(false); setOpen(false)}}
          className={"liNavBar " + select[0]}>
          <span></span><p>Página Inicial</p>
        </li>
      </Link>

      <Link to="/Actividade">
        <li onClick={() => { setSelect(["", "selected", "", "", ""]); setDropdownOpen(false); setOpen(false)}}
          className={"liNavBar " + select[1]}>
          <span></span><p>Actividades</p>
        </li>
      </Link>
 {/* Botão Hamburguer (visível apenas em telas pequenas) */}

      <li className={`relative ${open?"":"liNavBar"} cursor-pointer ` + select[4]}
          onClick={() => {
            setSelect(["", "", "", "", "selected"]);
            setDropdownOpen(prev => !prev);
          }}>
        <span></span>
        <p className={`flex items-center ${open?"hidden":""} justify-between gap-1 `}>
          Destaque
          <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </p>

        <ul className={`${open?"static flex flex-col items-center justify-center text-text-pargh gap-5":"absolute top-full right-0 mt-2 bg-white shadow-lg rounded w-[150px] "}  text-black   transition-all duration-300 ease-in-out transform 
                        ${!open?(dropdownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'):"visible"} z-50`}>
          <Link to="/Artigos">
          <li className={`${open?"liNavBar":"hover:bg-gray-100 px-4 py-2 "}`}
                onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); setOpen(false)}}><span></span><p>Artigos</p></li>
          </Link>
          <Link to="/Audios">
          <li className={`${open?"liNavBar":"hover:bg-gray-100 px-4 py-2 "}`}
                onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); setOpen(false)}}><span></span><p>Áudios</p></li>
          </Link>
          <Link to="/Videos">
          <li className={`${open?"liNavBar":"hover:bg-gray-100 px-4 py-2 "}`}
                onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); setOpen(false)}}><span></span><p>Vídeos</p></li>
          </Link>
          <Link to="/Salvacao">
          <li className={`${open?"liNavBar":"hover:bg-gray-100 px-4 py-2 "}`}
                onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); }}><span></span><p>✝️ Salvação Hoje!</p></li>
          </Link>
        </ul>
      </li>

      <li
        onClick={() => { setSelect(["", "", "", "selected", ""]); setDropdownOpen(false); setOpen(false)}}
        className={"liNavBar " + select[3]}>
        <span></span><p>Contactos</p>
      </li>

    </ul>
  </nav>
  );
}
