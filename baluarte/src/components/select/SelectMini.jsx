import { useEffect, useRef, useState } from "react"
import { FaChevronDown } from "react-icons/fa6"

export const SelectMini = ({ vect = [] }) => {
    const [selected, setSelected] = useState(vect[0])
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative min-w-[160px]" ref={ref}>
            <button 
              onClick={() => setOpen(!open)}
              className="flex justify-between items-center w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
            >
                <span className="truncate">{selected}</span>
                <FaChevronDown className="text-gray-500" size="0.8rem" />
            </button>

            {open && (
                <ul className="absolute top-full mt-1 bg-white border rounded-md shadow-lg z-40 w-full text-sm max-h-60 overflow-auto">
                    {vect.map((item, index) => (
                        <li key={index}>
                            <button 
                              onClick={() => {
                                  setSelected(item)
                                  setOpen(false)
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100"
                            >
                                {item}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}