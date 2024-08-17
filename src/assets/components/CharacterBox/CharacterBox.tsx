import { useState,  useRef } from 'react'
import About from './About';
import Rolls from './Rolls';
import MapGraphics from '../GameMasterBox/MapGraphics';
import MapAuthorizations from '../GameMasterBox/MapAuthorizations';
import { Signal, useSignalEffect, signal} from "@preact/signals-react";
import { characterDataType } from '../../types/characterTypes';
import { useLocalStorage, useLocalStorageSignal } from '../../hooks/useStorage';
import Login from './Login';
import EditAttributeDialog from './CharacterManipulation/EditAttributeDialog';
import AuxilaryCharacterButton from './AuxilaryCharacterButton';
import Combat from './Combat';
import { triggerSettingsWindow } from './Settings';
import { usersDataState } from '../../states/GlobalState';
import { useSocket } from '../../providers/SocketProvider';
import Skills from './CharacterWindow';
import { translate } from '../../Dictionaries/translate';
import CharacterWindow from './CharacterWindow';
import Relations from './Relations';

const chosenCharacterStorageKey = 'lets-roll-one-chosenID';
const charactersMapStorageKey = 'lets-roll-one-charactersMap';
const charactersStateStorageKey = 'lets-roll-one-charactersState';

const controller = new AbortController();
let fetchInProgress = false;
let refreshFilterState = false;
const REFRESH_FILTER_TIME = 50;

export const characterData = signal<characterDataType | undefined>(getPlaceholderData());
export const characterMapSignal = signal<characterMap>({});
export const characterNameSignal = signal<string>("");

export default function CharacterBox() {
    const [charactersMap, setCharactersMap] = useLocalStorage<characterMap>(charactersMapStorageKey, {});
    const socket = useSocket();

    useSignalEffect(() => setCharactersMap(characterMapSignal.value));

    const charactersState = useLocalStorageSignal<characterDataType[]>(charactersStateStorageKey, []);
    const chosenCharacter = useLocalStorageSignal<string>(chosenCharacterStorageKey, '');
    useSignalEffect(function(){
      characterData.value = charactersState.value.find(char => char.id === chosenCharacter.value)
      usersDataState.value.currentCharacterID = chosenCharacter.value;
    });
    // useSignalEffect(function(){
    //   const state = charactersState.value;
    //   const current = chosenCharacter.value;
    //   const characterToChange = state.find(v => v.id === current);
    //   if (!characterToChange) return;
    //   const newArray  = state.filter(v => v.id !== current);
    //   if (!characterData.value) return;
    //   newArray.push(characterData.value)
    //   charactersState.value = newArray;; 
    // });

    useSignalEffect(function(){
      if (!characterData.value) return;
      const newArray = charactersState.peek().filter(v => v.id !== chosenCharacter.value);
      newArray.push(characterData.value);
      charactersState.value = newArray;
    })



    // useSignalEffect(() => {console.log('co tam?', charactersState.value)})
    // const charactersMap = useRef<[characterMap, characterMap[]]>();
    // usePreviousCharacterData(characterData, chosenCharacter);
    // usePreviousCharacterData(characterData, '');

    //
    //

    // const [cData, setcData] = useLocalStorage<characterDataType[]>(cDataKey, []);
    const [openWindow, setOpenWindow] = useState('about');
    const userIsGM = usersDataState.value.isGM;

    socket.on('trigger-refresh', handleRefresh)

    function handleRefresh(){
      if (!chosenCharacter.value) return;
      if (refreshFilterState) return;
      refreshFilterState = true;
      setTimeout(() => refreshFilterState = false, REFRESH_FILTER_TIME);
      // if (fetchInProgress) controller.abort();
      downloadCharacterData(chosenCharacter.value, charactersState);
    }


  return (
    // <charactersContext.Provider value={cData}>
      <section id = 'character-box' >
        <EditAttributeDialog/>
        <div id = 'login-bar'>
          {/* <AuxilaryCharacterButton onClickEvent={triggerSettingsWindow} label = 'gear' /> */}
          <AuxilaryCharacterButton onClickEvent={handleRefresh} label = 'refresh' />
          <Login/>
        </div>

        {/* <CharacterChanger map = {charactersMap} currentID = {chosenCharacter}/> */}
        <CharacterChanger currentID = {chosenCharacter} mainState={charactersState}/>


        <div className = 'navigation-buttons'>
              <NavigationButton state = 'about' label = 'about'/>
              <NavigationButton state = 'actions' label = 'actions'/>
              <NavigationButton state = 'EQ' label = 'EQ'/>
              <NavigationButton state = 'skills' label = 'skills'/>
              <NavigationButton state = 'spells' label = 'spells'/>
              <NavigationButton state = 'relations' label = 'relations'/>


              {/* <NavigationButton state = 'rolls'/> */}
              {/* <NavigationButton state = 'combat'/> */}
              {/* {userIsGM && <NavigationButton state = 'MapGraphics' />} */}
              {/* {userIsGM && <NavigationButton state = 'mapAuthorizations' />} */}
        </div>


        <div id = 'character-info'>
            {/* {openWindow === 'rolls' && <Rolls/>}/ */}
            {openWindow === 'about' && <About/>}
            {openWindow === 'actions' && <CharacterWindow data = {characterData.value?.actions || []} attributeGroup={openWindow}/>}
            {openWindow === 'EQ' && <CharacterWindow data = {characterData.value?.EQ || []} attributeGroup={openWindow}/>}
            {openWindow === 'skills' && <CharacterWindow data = {characterData.value?.skills || []} attributeGroup={openWindow}/>}
            {openWindow === 'spells' && <CharacterWindow data = {characterData.value?.spells || []} attributeGroup={openWindow}/>}
            {openWindow === 'relations' && <Relations data = {characterData.value?.relations || []} />}
            {/* {openWindow === 'spells' && <Spells/>} */}
            {/* {openWindow === 'combat' && <Combat/>} */}
            {/* {openWindow === 'mapAuthorizations' && <MapAuthorizations/>} */}
            {/* {openWindow === 'MapGraphics' && <MapGraphics/>} */}


        </div>

      </section>
    // </charactersContext.Provider>

  )
  
  function NavigationButton({state, label} : navigationProps) {
    const clickedClass = 'character-box-button category-button character-box-clicked';
    const unClickedClass = 'character-box-button category-button character-box-clickable';
    const className = state === openWindow? clickedClass : unClickedClass;
    return( 
      <button className = {className} onClick = {() => setOpenWindow(state)}>{label? translate(label): state}</button>
    )

}







// type mapChanger = React.MutableRefObject<characterMap | undefined>
function CharacterChanger({ currentID, mainState}: changerProps){
  const dialogRef = useRef<HTMLDialogElement>(null);
  // useDefaultCharactersMap(setCharactersMap);
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
    const data = await fetch(`http://localhost:3000/character/${id}`, {signal});
    // const data = await fetch(`https://lro-2-alpha-backend-production.up.railway.app/character/${id}`);
    // console.log(data)
    const jsoned = await data.json();
    fetchInProgress = false;
    const prev = state.value.map(val => { return {...val}});
    console.log(jsoned)
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