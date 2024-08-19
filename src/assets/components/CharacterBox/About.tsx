import ListWithHeader from './ListWithHeader'
import { characterData } from './CharacterBox';
import { characterBasicValueType } from '../../types/characterTypes';
import { translate } from '../../Dictionaries/translate';
import { socket } from '../../providers/SocketProvider';
import { usersDataState } from '../../states/GlobalState';
import { useRef } from 'react';

export default function About() {
  const aboutData = characterData.value?.about;
  const [dataBatches, unorganizedData] = getBatchedProperties(aboutData?? []);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const newURLRef = useRef<HTMLInputElement>(null);
  if (!aboutData) return (<></>);
  if (aboutData.length === 0) return (<></>);

  return (
  <>
    <div  className = "character-info">
      <div className = 'about-box'>
        <div className = 'about-text'>
          <div className = 'about-header'>
            <div>
              <h1>{characterData.value?.name}</h1>
              <ListWithHeader data = {dataBatches[0]} attributeGroup='about' maxLength={1000} disableDelete = {true}/>
            </div>

            <img src= {characterData.value?.graphicUrl ?? 'https://s13.gifyu.com/images/S0Ird.png'} className = 'about-portrait' onClick = {handleImageClick}/>
          </div>
          <hr/>

          <BatchesComponent data = {dataBatches[1]}/>
          <BatchesComponent data = {dataBatches[2]}/>
          <BatchesComponent data = {dataBatches[3]}/>
          {/* <BatchesComponent data = {dataBatches[4]}/> */}
          <BatchesComponent data = {unorganizedData}/>

        <button className='character-box-button main-text' onClick = {handleAddNewClick}>{translate('Add new')}</button>


        </div>
      </div>
    </div>

    <dialog ref={dialogRef} className='character-box-button'>
      {translate('Insert URL to new graphic')}.
      <form onSubmit={handleNewGraphicURL}>
        <input type='text' className='Insert URL to new graphic' ref = {newURLRef}/>
        <input type = 'submit' style = {{'visibility': 'hidden'}} />
      </form>
    </dialog>
  </>
  )

  function handleImageClick(){
    if (!dialogRef.current) return;
    if (!dialogRef.current.open) dialogRef.current.showModal();
  }

  function handleNewGraphicURL(e:React.FormEvent){
    e.preventDefault();
    if(!newURLRef.current) return;
    if(newURLRef.current.value.length === 0) return;
    socket.emit('new-graphic', getEmitPayload(newURLRef.current.value));
    if (!dialogRef.current) return;
    newURLRef.current.value = '';
    if (dialogRef.current.open) dialogRef.current.close();
  }

}



function BatchesComponent({data}: {data: characterBasicValueType[]}){
  return(
    <>
         <ListWithHeader data = {data} attributeGroup='about' maxLength={1000}  disableDelete = {true}/>
         <hr/>
    </>
  )
}

function getBatchedProperties(data: characterBasicValueType[]): [characterBasicValueType[][], characterBasicValueType[]]{
  // if (data.length === 0) return [[], []];

  const batchMap = [['pronounce', 'identity', 'origin', 'theme'], ['level', 'classes'], 
  ['agility', 'power', 'will', 'inside'], ['fabulaPoints', 'initiative', 'armor', 'magicalDefence'] ];

  const prepedBatches: characterBasicValueType[][] = [];
  batchMap.forEach(group => prepedBatches.push([]));
  const leftover = data.map(prop => {
    for (let index = 0; index < batchMap.length; index++){
      if (batchMap[index].includes(prop.label)){
        prepedBatches[index].push(prop);
        return;
      }
    }
    return prop;
  }).filter(prop => prop) as characterBasicValueType[];

  return [prepedBatches, leftover];
}

function handleAddNewClick(){
  socket.emit('new-character-attribute', getEmitPayload('???'));
}

function getEmitPayload(value: string){
  return {
      userID: usersDataState.value.userID,
      characterID: usersDataState.value.currentCharacterID,
      attributesGroup: 'about',
      value: value,
      label: 'New'
  };
}


