export const ListItem=({text,classe,setValue,value})=>{
    return  <li className={classe} onClick={
        ()=>{
            setValue(value)
        }
    }><p>{text}</p><span></span></li>
}
