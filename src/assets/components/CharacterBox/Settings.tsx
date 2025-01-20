import { useRef } from 'react';
import {  signal } from '@preact/signals-react';
import ColorPicker from '../ColorPicker';

const APP_SETTINGS_STEPS_SOUND = 'LRO-application-settings-steps';
export const stepSounds = signal(defaultStepsSound());
import { displayerMode } from '../../../App';


export default function Settings() {
    const dialogRef = useRef<HTMLDialogElement>(null);
    // const buttonText = stepSounds.value? 'Steps sound active' : 'Steps sound muted';
    return(
        <dialog className='settings-dialog character-box-button' ref = {dialogRef}>
          <div className='edit-dialog'>
            <h2>Application's Settings</h2>
            {/* <button onClick = {handleClick} className= {'character-box-button character-box-clickable'}> {buttonText} </button> */}
            <ColorPicker/>
          </div>
          <div>
            <label> Turn on displayer mode (only way to reverse this is refreshing the page!)</label>
            <input type = 'checkbox' onClick={handleDisplayerModeClick} />
          </div>
        </dialog>
    )

    function handleDisplayerModeClick(){
      if (!dialogRef.current) return;
      dialogRef.current.close();
      displayerMode.value = true;

    }

    // function handleClick(){
    //   stepSounds.value = stepSounds.value? 0: 1;
    //   localStorage.setItem(APP_SETTINGS_STEPS_SOUND, stepSounds.value? '1' : '0');
    //   if (dialogRef.current) dialogRef.current.close();
    // }
}


export function triggerSettingsWindow(){
  const dialogObject: HTMLDialogElement | null = document.querySelector('.settings-dialog');
  if (!dialogObject) return;
  if (!dialogObject.open) dialogObject.showModal();
}


  function defaultStepsSound(){
    const fromStorage = localStorage.getItem(APP_SETTINGS_STEPS_SOUND);
    if (!fromStorage) return 0;
    return Number(fromStorage);
  }
