import React from 'react'
import { relationType, emotionForceType } from '../../types/characterTypes'
import DipSwitchWithReset from '../DipSwitchWithReset'
import { useState, useRef, useEffect } from 'react'
import { usersDataState } from '../../states/GlobalState'
import { socket } from '../../providers/SocketProvider'

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
    useEffect(() => oneRelationUseEffect(firstRender), [...emotionStates]);
    return(
        <>
                    label: {label}
                    relation force: 1,
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
        </>
    )
}

function oneRelationUseEffect(firstRender: React.MutableRefObject<boolean>){
    if (firstRender.current){
        firstRender.current = false;
        return;
    }
    console.log('socketuję', emotionStates)
    // socket.emit('edit-character-attribute', getEmitPayload(emotionStates, id))
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

