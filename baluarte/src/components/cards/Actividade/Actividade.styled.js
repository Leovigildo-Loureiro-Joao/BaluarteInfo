import styled from "styled-components";

export const MinActivyStyled=styled.article`
   
    cursor: grab;
   

   .textoBox{
        height: 40%;
       justify-content: end;
       transition: 0.3s all;
    }

    #texto{
        overflow: hidden; 
    }

    :hover .textoBox{
        height: 100%;
        transition: 0.3s;
    }

    
`