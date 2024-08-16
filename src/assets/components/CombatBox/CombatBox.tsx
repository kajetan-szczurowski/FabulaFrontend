import Clock from "./Clock"
import { signal } from "@preact/signals-react"
import React, { useState, useRef } from "react";
import { socket } from "../../providers/SocketProvider";
import { usersDataState } from "../../states/GlobalState";
import CharacterBars from "./CharacterBars";
import { translate } from "../../Dictionaries/translate";

export const clocksState = signal<clockType[]>(defaultState('get-clocks')); 
export const characterBarsState = signal<characterBarType[]>(defaultState('get-character-bars'));

function defaultState(socketOrder: string){
  socket.emit(socketOrder);
  return [];
}

export default function CombatBox() {
  const [currentWindow, setCurrentWindow] = useState<'party' | 'clocks'>('party');
  const userIsGM = usersDataState.value.isGM;
  const userID = usersDataState.value.userID;
  const newLabelRef = useRef<HTMLInputElement>(null);
  const newSegmentsRef = useRef<HTMLInputElement>(null);


  socket.on('clocks-data', (newClocksData: clockType[]) => clocksState.value = newClocksData);
  socket.on('character-bars', (newBars: characterBarType[]) => characterBarsState.value = newBars);



  return(
    <section id = 'combat-box'>
      <Navigation/>
      {currentWindow === 'clocks' && <Clocks/>}
      {currentWindow === 'party' && <CharacterBars/>}
    </section>
  )
  

  function Clocks(){
    let index = -1;
    return (
      <>
      <div className="clocks-box">
        {clocksState.value.map(clock => {
          index++;
          return(
              <Clock segmentsNumber={clock.segments} completedSegments={clock.completedSegments} id = {clock.id} label = {clock.label} key = {clock.id}/>
        )})}
      </div>
      {userIsGM && <NewClockForm/>}
      </>
    )
  }

  function NewClockForm(){
    return(<form onSubmit={handleNewClock}>
      <input ref = {newLabelRef} type = 'text' placeholder = 'Label'/>
      <input ref = {newSegmentsRef} type = 'number' placeholder = 'Segments'/>
      <button type ='submit'>Create</button>
    </form>)
  }

  function handleNewClock(event: React.FormEvent){
    event.preventDefault();
    if(!newLabelRef.current) return;
    if(!newSegmentsRef.current) return;

    const label = newLabelRef.current.value;
    const segments = Number(newSegmentsRef.current.value);
    // socket.emit('clock-order', 'co')
    // socket.emit('clock-order', {userID: userID});

    socket.emit('clock-order', {userID: userID, clockID: '', order: 'append', newLabel: label, newSegments: segments});
  }

  function Navigation(){
    const buttonClass = 'character-box-button main-text';
    const activeButtonClass = `${buttonClass} character-box-clicked`;
    return(<div className = 'combat-navigation'>
      <button className={currentWindow === 'party'? activeButtonClass : buttonClass} onClick = {() => setCurrentWindow('party')}>{translate('party')}</button>
      <button className={currentWindow === 'clocks'? activeButtonClass : buttonClass} onClick = {() => setCurrentWindow('clocks')}>{translate('clocks')}</button>
    </div>)
  }

}

type clockType = {
  segments: number,
  completedSegments: number,
  label: string,
  id: string
}

type characterBarType = {
  id: string,
  graphicUrl: string,
  name: string,
  HP: barType,
  PM: barType,
  EP: barType
}

type barType = {
  max: number,
  current:number
}