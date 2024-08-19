import { MessageType } from "./Chat"
import NumericAndTextSpans from "../NumericAndTextSpans";

export default function Message({data}:props) {
    const {messageTypeName, text, sender, rawOrder, result, comment} = data;

  return(
    <div>
        <MessageContent />
    </div>
  )


  function MessageContent(){
    const naturalClass = isNatural(text, rawOrder)? 'critical-roll': '';
    switch(messageTypeName) {
        case 'system':return(<span className = 'system-message'>{text}</span>)
        case 'message': return(
            <>
                <span className = 'message-sender'>{sender}: </span>
                <span className = 'message-text'>{text}</span>
            </>

        )

        case 'roll': return(
            <>
                <span className = 'message-sender'>{sender}: </span>
                <span className = 'in-brackets message-raw-roll'>
                    <NumericAndTextSpans value = {rawOrder} digitsClass="message-raw-roll digit-font" nonDigitsClass="message-raw-roll"/>
                </span>
                <span className={'splited-result-wrapper ' + naturalClass}>
                    <NumericAndTextSpans value = {text} digitsClass="message-splited-result digit-font" nonDigitsClass="message-splited-result"/>
                </span>
                <> </>
                <NumericAndTextSpans value = {result} digitsClass="message-roll-result digit-font" nonDigitsClass="message-roll-result"/>
                {comment && <> </>}
                {comment && <NumericAndTextSpans value = {comment} digitsClass="message-roll-comment digit-font" nonDigitsClass="message-roll-comment"/>}
            </>
        )
      }
  }

  function isNatural(rollText: string, rollOrder: string | undefined){
    if (!rollOrder) return false;
    const rolls = rollOrder?.match(/(\d?)+d/g);
    if (!rolls) return false;
    const diceCount = countDices(rolls);
    if (diceCount !== 2) return false;
    return checkRollForCritical(rollText);
  }
} 

function countDices(dicesArray: string[]){
    let count = 0;
    dicesArray.forEach(dice => {
        const current = dice.replace('d', '');
        const append = (current.length === 0)? 1 : Number(current);
        count += append;
    })
    return count;
}

function checkRollForCritical(rollText: string){
    const separated = rollText.split('+').map(item => Number(item));
    if (separated.length < 2) return false;
    if (separated[0] !== separated[1]) return false;
    return separated[0] === 1 || separated[0] > 5;
}

type props = {
    data : MessageType
}
