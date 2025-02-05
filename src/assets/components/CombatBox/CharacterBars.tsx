import { characterBarsState } from './CombatBox'
import { usersDataState } from '../../states/GlobalState';
import ProgressBar from '../CharacterBox/ProgressBar';
import DropDownList from '../DropDownList';
import { characterMapSignal } from '../CharacterBox/CharacterBox';
import { useSocket } from '../../providers/SocketProvider';
import { ChangeEvent } from 'react';
import { translate } from '../../Dictionaries/translate';
import { useRef } from 'react';

export default function CharacterBars() {
    const bars = characterBarsState.value;
    const userID = usersDataState.value.userID;
    const userIsGM = usersDataState.value.isGM;
    const characters = characterMapSignal.value;
    const socket = useSocket();
    const sectionRef = useRef<HTMLDivElement>(null);

    return(
        <>
            <h2 onDoubleClick={handleDoubleClick} className="relation-text">{translate('party')}:</h2>
            <section ref = {sectionRef} className = 'hp-list'>
            {bars.map(bar => {
                const authorized = checkAuthorization(bar.id, bar.name);
                return(
                <div className='character-bar-list-item' key = {bar.id}>
                    <div className = 'character-bar-thumbnail'>
                        <img src = {bar.graphicUrl} className = 'hp-list-img'/>
                        <div className = 'hp-list-label'>{bar.name}</div>
                    </div>
                    
                    <div className = 'character-bar-description-wrapper'>
                        <ProgressBar authorization = {authorized} id = {bar.id} widthRem={5} value = {bar.HP.current} maxValue={bar.HP.max} foregroundClassName='hp-bar' socketEditKey = {'change-character-bar'} label = {bar.name} section = 'HP'/>
                        <ProgressBar authorization = {authorized} id = {bar.id} widthRem={5} value = {bar.PM.current} maxValue={bar.PM.max} foregroundClassName='magic-bar' socketEditKey = {'change-character-bar'} label = {bar.name} section = 'PM'/>
                        <ProgressBar authorization = {authorized} id = {bar.id} widthRem={5} value = {bar.EP.current} maxValue={bar.EP.max} foregroundClassName='eq-bar' socketEditKey = {'change-character-bar'} label = {bar.name} section = 'EP'/>
                    </div>
                </div>
            )})}
            </section>
            {userIsGM && <DropDownList options={Object.keys(characters)} changeHandler = {handleSelectChange}/>}
        </>
    )

    function handleDoubleClick(e: React.MouseEvent){
        e.preventDefault();
        if (!sectionRef.current) return;
        sectionRef.current.classList.toggle('hp-list-displayer-mode');
    }

    function handleSelectChange(e: ChangeEvent<HTMLSelectElement>){
        if (e.target.value === 'dummy') return;
        const choosenID = getChosenID(e.target.value);
        socket.emit('toogle-character-bar', {userID: userID, characterID: choosenID})
    }

    function getChosenID(chosenName: string){
        let name: string
        for (name of Object.keys(characters)){
            if (name === chosenName) return characters[name];
        } 
    }

}

function checkAuthorization(characterID: string, characterName:string):boolean{
    if (usersDataState.value.isGM) return true;

    const authorizedCharacters = usersDataState.value.charactersMap;
    for (let key of Object.keys(authorizedCharacters)){
        if (authorizedCharacters[key] === characterID && key === characterName) return true;
    }
    return false;
}