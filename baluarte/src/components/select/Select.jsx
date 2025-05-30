import { useEffect, useRef, useState } from "react"
import { FaChevronDown, FaPerson } from "react-icons/fa6"
import { LiaArrowDownSolid } from "react-icons/lia"
import { RxArrowDown, RxPerson } from "react-icons/rx"

export const Select = ({ vect = [], icon: Icon = RxPerson ,onChange,modal=false,title=""}) => {
    

    if(modal) return <SelectRadio vect={vect} title={title} onChange={onChange}/>
    else return <SelectChevrom vect={vect} icon={Icon} onChange={onChange}/>
}

const SelectRadio=({vect = [],title,selected})=>{
    return <article className="m-4 mx-10">
        <h2 className="my-4 text-text-pargh text-primary">{title}</h2>
        {vect.map((value, i) => (
            <div className="radio-item"><label>{value}</label>
                <input  type="checkbox" 
                    className=" accent-white w-6 h-6 checked:accent-primary transition-all duration-100 block text-start px-4 py-2 hover:bg-gray-100 text-sm"
                    aria-selected={selected === value}
                radioGroup={title} />
                
            </div>
        ))}
    </article>
}


const SelectChevrom=( {vect = [],icon: Icon = RxPerson,onChange})=>{
    const dropdownRef = useRef(null)
    const [selected, setSelected] = useState(vect[0])
    const [open, setOpen] = useState(false)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (value) => {
        setSelected(value)
        setOpen(false)
        if (onChange) onChange(value)
    }
    return (
        <div className="flex flex-col relative min-w-[200px]" ref={dropdownRef}>
            <button 
              onClick={() => setOpen(!open)} 
              className="flex items-center justify-between border-gray-400 border p-4 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-haspopup="listbox"
              aria-expanded={open}
            >
                <span className="flex items-center gap-2 text-base">
                    {Icon && <Icon />}
                    {selected}
                </span>
                <FaChevronDown />
            </button>

            {open && (
                <ul className="absolute top-full mt-2 bg-white border rounded-lg shadow-lg w-full z-[100] max-h-60 overflow-y-auto" role="listbox">
                    {vect.map((value, i) => (
                        <li key={i}>
                            <button 
                              className="block w-full text-start px-4 py-2 hover:bg-gray-100 text-base"
                              onClick={() => handleSelect(value)}
                              role="option"
                              aria-selected={selected === value}
                            >
                                {value}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

