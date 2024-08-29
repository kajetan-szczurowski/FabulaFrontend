import { useState,  useRef } from 'react'
import About from './About';
import { Signal, useSignalEffect, signal} from "@preact/signals-react";
import { characterDataType } from '../../types/characterTypes';
import { useLocalStorage, useLocalStorageSignal } from '../../hooks/useStorage';
import Login from './Login';
import EditAttributeDialog from './CharacterManipulation/EditAttributeDialog';
import AuxilaryCharacterButton from './AuxilaryCharacterButton';
import { triggerSettingsWindow } from './Settings';
import { usersDataState } from '../../states/GlobalState';
import { useSocket } from '../../providers/SocketProvider';
import { translate } from '../../Dictionaries/translate';
import CharacterWindow from './CharacterWindow';
import Relations from './Relations';

const chosenCharacterStorageKey = 'lets-roll-one-chosenID';
const charactersMapStorageKey = 'lets-roll-one-charactersMap';
const charactersStateStorageKey = 'lets-roll-one-charactersState';

const controller = new AbortController();
let fetchInProgress = false;
fetchInProgress; //probably bug in Typescript. Without this line vite won't buil dist
let refreshFilterState = false;
const REFRESH_FILTER_TIME = 50;

export const characterData = signal<characterDataType | undefined>(getPlaceholderData());
export const characterMapSignal = signal<characterMap>({});
export const characterNameSignal = signal<string>("");

export default function CharacterBox() {
    const [charactersMap, setCharactersMap] = useLocalStorage<characterMap>(charactersMapStorageKey, {});
    const firstDownloadComplete = useRef(false);
    const socket = useSocket();

    useSignalEffect(() => setCharactersMap(characterMapSignal.value));

    const charactersState = useLocalStorageSignal<characterDataType[]>(charactersStateStorageKey, []);
    const chosenCharacter = useLocalStorageSignal<string>(chosenCharacterStorageKey, '');
    if (!firstDownloadComplete.current) setTimeout(handleRefresh, 100);
    useSignalEffect(function(){
      characterData.value = charactersState.value.find(char => char.id === chosenCharacter.value)
      usersDataState.value.currentCharacterID = chosenCharacter.value;
    });

    useSignalEffect(function(){
      if (!characterData.value) return;
      const newArray = charactersState.peek().filter(v => v.id !== chosenCharacter.value);
      newArray.push(characterData.value);
      charactersState.value = newArray;
    })


    const [openWindow, setOpenWindow] = useState('about');

    socket.on('trigger-refresh', handleRefresh)

    function handleRefresh(){
      if (!chosenCharacter.value) return;
      if (refreshFilterState) return;
      refreshFilterState = true;
      setTimeout(() => refreshFilterState = false, REFRESH_FILTER_TIME);
      // if (fetchInProgress) controller.abort();
      downloadCharacterData(chosenCharacter.value, charactersState);
      if (!firstDownloadComplete.current) firstDownloadComplete.current = true;
    }


  return (
    // <charactersContext.Provider value={cData}>
      <section id = 'character-box' >
        <EditAttributeDialog/>
        <div id = 'login-bar'>
          <AuxilaryCharacterButton onClickEvent={triggerSettingsWindow} label = 'gear' />
          <AuxilaryCharacterButton onClickEvent={handleRefresh} label = 'refresh' />
          <Login/>
        </div>

        <CharacterChanger currentID = {chosenCharacter} mainState={charactersState}/>


        <div className = 'navigation-buttons'>
              <NavigationButton state = 'about' label = 'about'/>
              <NavigationButton state = 'actions' label = 'actions'/>
              <NavigationButton state = 'EQ' label = 'EQ'/>
              <NavigationButton state = 'skills' label = 'skills'/>
              <NavigationButton state = 'spells' label = 'spells'/>
              <NavigationButton state = 'relations' label = 'relations'/>

        </div>


        <div id = 'character-info'>
            {openWindow === 'about' && <About/>}
            {openWindow === 'actions' && <CharacterWindow data = {characterData.value?.actions || []} attributeGroup={openWindow}/>}
            {openWindow === 'EQ' && <CharacterWindow data = {characterData.value?.EQ || []} attributeGroup={openWindow}/>}
            {openWindow === 'skills' && <CharacterWindow data = {characterData.value?.skills || []} attributeGroup={openWindow}/>}
            {openWindow === 'spells' && <CharacterWindow data = {characterData.value?.spells || []} attributeGroup={openWindow}/>}
            {openWindow === 'relations' && <Relations data = {characterData.value?.relations || []} />}


        </div>

      </section>

  )
  
  function NavigationButton({state, label} : navigationProps) {
    const clickedClass = 'character-box-button category-button character-box-clicked';
    const unClickedClass = 'character-box-button category-button character-box-clickable';
    const className = state === openWindow? clickedClass : unClickedClass;
    return( 
      <button className = {className} onClick = {() => setOpenWindow(state)}>{label? translate(label): state}</button>
    )

}







function CharacterChanger({ currentID, mainState}: changerProps){
  const dialogRef = useRef<HTMLDialogElement>(null);
  const name = handleName();
  characterNameSignal.value = name;
  return(
    <>
      <button onClick = {handleButtonClick} className = "character-box-button choosing-button character-box-clickable" >{name}</button>
      <dialog className = 'character-changer' ref = {dialogRef}>
        <div>
          <DialogContent />
        </div>
      </dialog>
    </>
  )

  function DialogContent(){
    const buttonClass = 'character-box-button category-button character-box-clickable';
    if (!Object.keys(charactersMap).length) return( <> Nothing to show. Please contact your GM.</>);
    const charactersArray = compileCharactersArray();
    return(
      <>
        {charactersArray.map(character => {
          return(<button className={buttonClass} key = {character.id} onClick = {() => handleClick(character.id)}>{character.name}</button>)
        })}
  
      </>
    )

    function handleClick(id:string){
      if(!dialogRef.current) return;
      dialogRef.current.close();
      currentID.value = id;
      if (mainState.value.find(character => character.id === currentID.value)) return;
      downloadCharacterData(id, mainState);
    }

  }

  function compileCharactersArray(){
    return Object.keys(charactersMap).map(oneCharacter => {
      return {id: charactersMap[oneCharacter], name: oneCharacter}
  })

}

  function handleButtonClick(){
    if (!dialogRef.current) return;
    dialogRef.current.showModal();
  }

  function handleName(defaultName = '*characters*'){
    return characterData.value?.name || defaultName;
  }

}

}

function getPlaceholderData():characterDataType{
  return{
    id: '',
    name: '',
    maxHP: '',
    currentHP: '',
    maxEP: '',
    currentEP: '',
    maxMagic: '',
    currentMagic: '',
    graphicUrl: '',
  
    about: [],
    actions: [],
    EQ: [],
    skills: [],
    spells: [],
    rolls: [],
    relations: []
  }
}


export async function downloadCharacterData(id: string, state: Signal<characterDataType[]>){
  const signal = controller.signal;
  fetchInProgress = true;
  try{
    // const data = await fetch(`http://localhost:3000/character/${id}`, {signal});
    // const data = await fetch(`https://lro-2-alpha-backend-production.up.railway.app/character/${id}`);
    const data = await fetch(`https://fu-temporaty-backend-production.up.railway.app/character/${id}`, {signal});
    const jsoned = await data.json();
    fetchInProgress = false;
    const prev = state.value.map(val => { return {...val}});
    const newArray = prev.filter(val => val.id !== id);
    newArray.push(jsoned);
    state.value = newArray;

  }catch{ fetchInProgress = false; return;}
}


type navigationProps = {
  state: string,
  label?: string
}

type characterMap = {[key: string]: string};

type changerProps = {
  currentID: Signal<string>,
  mainState: Signal<characterDataType[]>
}