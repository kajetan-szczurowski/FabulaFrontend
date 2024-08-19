import DipSwitchWithReset from "./DipSwitchWithReset";
import { useLocalStorage } from "../hooks/useStorage";
import { useEffect } from "react";
import { usersDataState } from "../states/GlobalState";

export default function ColorPicker() {
  const PICKED_INDEX_STORAGE_KEY = 'fabula-chat-color-index-picked';
  const PICKED_VALUE_STORAGE_KEY = 'fabula-chat-color-value-picked';
  const uncheckedColorClass = "character-box-button";
  const checkedColorClass = "character-box-button main-text character-box-clicked";
  const [pickedColor, setPickedColor] = useLocalStorage<number>(PICKED_INDEX_STORAGE_KEY, -1);

  const COLORS: rgbType[] = [[176, 145, 84], [121, 0, 0], [123, 46, 0], [125, 46, 0], [130, 123, 0], [64, 102, 24],
                [0, 94, 32], [0, 88, 38], [0, 89, 82], [0, 91, 127], [0, 54, 99], [0, 33, 87], 
                [13, 0, 76], [50, 0, 75], [75, 0, 73], [123, 0, 70]];
  
  const options = COLORS.map(rgb => String(rgb));
  useEffect(() => saveColor(pickedColor, COLORS, PICKED_VALUE_STORAGE_KEY), [pickedColor]);

  return(
    <>
    <h3>Color in chat:</h3>
    <section className = 'color-picker'>
        <DipSwitchWithReset labels = {options} ComponentInside={ColorOption} checkedClass={checkedColorClass} uncheckedClass={uncheckedColorClass} chosenStateValue={pickedColor} chosenSetState={setPickedColor}/>
    </section>
    </>

  )
}

function ColorOption({label}: colorOptionType){
    const processedLabel = label.replaceAll(',', ', ');
    return(
        <div className = 'rgb-picker-option'>
            <div className = 'rgb-preview' style = {{backgroundColor: `rgb(${processedLabel})`}}></div>
            <div className="rgb-option-text digit-font">{processedLabel}</div>
        </div>
    )
}

function saveColor(colorIndex: number, colorPresets: rgbType[], localStorageKey: string){
    if (colorIndex < 1 || colorIndex > colorPresets.length) return;
    const newColor = String(colorPresets[colorIndex - 1]);
    usersDataState.value = {...usersDataState.value, chatColor: newColor};
    localStorage.setItem(localStorageKey, newColor);
}

// function handleSelectChange(e: ChangeEvent<HTMLSelectElement>){
//     if (e.target.value === 'dummy') return;
//     const choosenID = getChosenID(e.target.value);
//     socket.emit('toogle-character-bar', {userID: userID, characterID: choosenID})
// }

type rgbType = [number, number, number];
type colorOptionType = {label: string}