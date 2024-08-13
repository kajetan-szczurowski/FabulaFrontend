import React from 'react'

export default function DipSwitchWithReset({uncheckedClass, checkedClass, chosenStateValue, chosenSetState, labels}: props) {
  let index = 0;
  return (
    <>
      {labels.map(buttonName => {
        index++;
        const currentClass = index === chosenStateValue? checkedClass: uncheckedClass;
        return(
          <button className={currentClass} onClick={() => handleClick(buttonName)} key = {`dipSwitch-${index}`}>{buttonName}</button>
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
}

type props = {
  uncheckedClass: string,
  checkedClass: string,
  chosenStateValue: number,
  chosenSetState: React.Dispatch<React.SetStateAction<number>>,
  labels: string[]
}