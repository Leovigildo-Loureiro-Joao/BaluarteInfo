export const ListItem=({text,classe,setValue,value})=>{
    return  <li className={classe} onClick={
        ()=>{
            setValue(value)
        }
    }><p className="whitespace-nowrap">{text}</p><span></span></li>
}
