import React, {FC} from 'react'

export default function DipSwitchWithReset({uncheckedClass, checkedClass, chosenStateValue, chosenSetState, labels, ComponentInside}: props) {
  let index = 0;
  return (
    <>
      {labels.map(buttonName => {
        index++;
        const currentClass = index === chosenStateValue? checkedClass: uncheckedClass;
        return(
          <ItemWrapper key = {`dipSwitch-${index}`} buttonClassName={currentClass} label={buttonName}/>
        )
      })}
    </>
  )


  function handleClick(name: string){
    const chosenID = labels.findIndex((lab) => lab === name) + 1;
    if (chosenStateValue === chosenID){
      chosenSetState(0);
      return;
    }
    chosenSetState(chosenID);
  }

  function ItemWrapper({buttonClassName, label}: itemWrapperProps){
    return(
      <>
       {!ComponentInside && <button className={buttonClassName} onClick={() => handleClick(label)} >{label}</button>}
       {ComponentInside && <button className={buttonClassName} onClick={() => handleClick(label)} key = {`dipSwitch-${index}`}><ComponentInside label={label} /></button>}
      </>
    )
  
  }

}



type props = {
  uncheckedClass: string,
  checkedClass: string,
  chosenStateValue: number,
  chosenSetState: React.Dispatch<React.SetStateAction<number>>,
  labels: string[],
  ComponentInside?: FC<{label: string}>
}

type itemWrapperProps = {
  buttonClassName: string,
  label: string
}