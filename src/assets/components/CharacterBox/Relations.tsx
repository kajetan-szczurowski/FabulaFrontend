import React from 'react'
import { relationType, emotionForceType } from '../../types/characterTypes'
import DipSwitchWithReset from '../DipSwitchWithReset'
import { useState } from 'react'

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
    
    const [emotionStates, emotionSetters, labels] = oneRelationHeader(emotions);

    return(
        <>
                    label: {label}
                    relation force: 1,
        <div className = 'relation-dip-switches-wrapper'>
            {[0,1,2].map(index => {
                return(
                    <div key = {index} className = 'relation-dip-switch'>
                        <DipSwitchWithReset checkedClass={CHECKED_CLASS} uncheckedClass={UNCHECKED_CLASS} chosenSetState={emotionSetters[index]} chosenStateValue={emotionStates[index]} labels = {labels[index]}/>
                    </div>
                )
            })}
        </div>
        </>
    )
}

function oneRelationHeader(emotions: emotionForceType[]): [number[], React.Dispatch<React.SetStateAction<number>>[], string[][]]{
    const currentEmotions = emotions.length >= 3? emotions : [0,0,0];
    const [firstEmotion, setFirstEmotion] = useState(currentEmotions[0]);
    const [secondEmotion, setSecondEmotion] = useState(currentEmotions[1]);
    const [thirdEmotion, setThirdEmotion] = useState(currentEmotions[2]);
    const emotionStates: number[] = [firstEmotion, secondEmotion, thirdEmotion];
    const emotionSetters: React.Dispatch<React.SetStateAction<number>>[] = [setFirstEmotion, setSecondEmotion, setThirdEmotion];
    const labels = [["admiration", "inferiority"], ["loyalty", "distrust"], ["sympathy", "hate"]]
    return [emotionStates, emotionSetters, labels];
}

type props = {
    data: relationType[];
}

