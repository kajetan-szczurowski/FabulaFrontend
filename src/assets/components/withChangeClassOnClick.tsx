import {  useState, useEffect } from 'react'
import { clickedClassMemory } from '../states/GlobalState';

export  function withChangeClassOnClick(ComponentToClick: any, ComponentToChangeClasss: any, id?: string) {
    return function ChangingComponent(hocProps: any){
        const [clicked, setClicked] = useState(getDefaultState(id));
        useEffect(function(){
          if (!id) return;
          clicked? clickedClassMemory.value[id] = true: delete clickedClassMemory.value[id];
        }, [clicked]);
        
        return (
          <>
           <ComponentToClick  clicked = {clicked} setClicked = {setClicked}/>
           <ComponentToChangeClasss clicked = {clicked} {...hocProps}/>
          </>
        )
    }
}

function getDefaultState(id?: string){
  if (!id) return false;
  if (clickedClassMemory.value[id]) return true;
  return false;
}
