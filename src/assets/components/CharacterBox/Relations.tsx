import React from 'react'
import { relationType, emotionForceType } from '../../types/characterTypes'
import DipSwitchWithReset from '../DipSwitchWithReset'
import { useState, useRef, useEffect } from 'react'
import { usersDataState } from '../../states/GlobalState'
import { socket } from '../../providers/SocketProvider'
import { withChangeClassOnClick } from '../withChangeClassOnClick'


const UNCHECKED_CLASS = "character-box-button main-text";
const CHECKED_CLASS = "character-box-button main-text character-box-clicked";


export default function Relations({data}: props) {
  return (
    <div  className = "character-info">
        <>
        {data.map(relation => {return(
            <OneRelation {...relation} key = {relation.id}/>
        )})}
        </>
    </div>
  )


}

function OneRelation({label, id, emotions}: relationType){
    const firstRender = useRef(true);
    const [emotionStates, emotionSetters, labels] = oneRelationHeader(emotions);
    useEffect(() => oneRelationUseEffect(firstRender, emotionStates, id), [...emotionStates]);
    const strength = getRelationStrength(emotionStates);
    const EmotionsSetting = withChangeClassOnClick(Header, BodyExpandableWrapper, id);
    return(
        <>
                    <h2>{label}</h2>
                    relation force: {strength},
                    <EmotionsSetting/>

        </>
    )

    function EmotionsComponent(){
        return(
            <div className = 'relation-dip-switches-wrapper'>
            {[0,1,2].map(index => {
                const currentSetter = emotionSetters[index] as React.Dispatch<React.SetStateAction<number>>;
                return(
                    <div key = {index} className = 'relation-dip-switch'>
                        <DipSwitchWithReset checkedClass={CHECKED_CLASS} uncheckedClass={UNCHECKED_CLASS} chosenSetState={currentSetter} chosenStateValue={emotionStates[index]} labels = {labels[index]}/>
                    </div>
                )
            })}
        </div>
        )
}

function Header({clicked, setClicked}: toClickType){
    // const socketOrder = {attributesGroup: attributeGroup, attributeID: id, attributeSection: 'label'};
    return(
    <div>
        <div className = 'item-label'>
            <div>Emotions</div>
        {/* <div><EditableAttribute text = {label} maxLength={MAX_LENGTH_HEADER} title = {label} {...socketOrder} /></div> */}
          <div className={`visibility-controll-clicked-${clicked} visibility-controll character-box-clickable`} style = {{background: 'none'}} onClick = {function(){setClicked(prev => !prev)}}>v</div>
        </div>
    </div>
  )}

  function BodyExpandableWrapper({clicked}: toClickType){
    return(
      <div className={`visible-${clicked}`}>
        <EmotionsComponent />
      </div>
    )
  }

}


function getRelationStrength(emotions: emotionForceType[]){
    let strength = 0;
    emotions.forEach(emotion => {if (emotion) strength++});
    return strength;
}

function oneRelationUseEffect(firstRender: React.MutableRefObject<boolean>, emotionStates: emotionForceType[], relationID: string){
    if (firstRender.current){
        firstRender.current = false;
        return;
    }
    // console.log('socketuję', emotionStates)
    socket.emit('edit-character-attribute', getEmitPayload(emotionStates, relationID))
}

function getEmitPayload(emotionsArray: emotionForceType[], relationID: string){
    return {
        userID: usersDataState.value.userID,
        characterID: usersDataState.value.currentCharacterID,
        attributesGroup: 'relations',
        attributeID: relationID,
        attributeSection: 'emotions',
        value: emotionsArray,
        label: undefined
    };
}

function oneRelationHeader(emotions: emotionForceType[]): [emotionForceType[], React.Dispatch<React.SetStateAction<emotionForceType>>[], string[][]]{
    const currentEmotions: emotionForceType[] = emotions.length >= 3? emotions : [0,0,0];
    const [firstEmotion, setFirstEmotion] = useState<emotionForceType>(currentEmotions[0]);
    const [secondEmotion, setSecondEmotion] = useState<emotionForceType>(currentEmotions[1]);
    const [thirdEmotion, setThirdEmotion] = useState<emotionForceType>(currentEmotions[2]);
    const emotionStates: emotionForceType[] = [firstEmotion, secondEmotion, thirdEmotion];
    const emotionSetters: React.Dispatch<React.SetStateAction<emotionForceType>>[] = [setFirstEmotion, setSecondEmotion, setThirdEmotion];
    const labels = [["admiration", "inferiority"], ["loyalty", "distrust"], ["sympathy", "hate"]]
    return [emotionStates, emotionSetters, labels];
}





type props = {
    data: relationType[];
}

type toClickType = {
    clicked : boolean,
    setClicked : React.Dispatch<React.SetStateAction<boolean>>
}