import { useState } from "react"
import { FaChevronDown, FaPerson } from "react-icons/fa6"
import { LiaArrowDownSolid } from "react-icons/lia"
import { RxArrowDown, RxPerson } from "react-icons/rx"

export const Select = ({ vect = [], icon: Icon = RxPerson }) => {
    const [selected, setSelected] = useState(vect[0])
    const [open, setOpen] = useState(false)

    return (
        <div className="flex flex-col relative">
            <button 
              onClick={() => setOpen(!open)} 
              className="flex items-center justify-between border-gray-400 border p-5 rounded-lg min-w-[200px]"
            >
                <span className="flex items-center gap-2 text-xl">
                    <Icon />
                    {selected}
                </span>
                <FaChevronDown />
            </button>

            {open && (
                <div className="absolute top-full mt-2 bg-white border rounded-lg shadow-lg w-full z-10">
                    {vect.map((value, i) => (
                        <button 
                          key={i}
                          className="block w-full text-start text-xl px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                              setSelected(value)
                              setOpen(false)
                          }}
                        >
                            {value}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}


