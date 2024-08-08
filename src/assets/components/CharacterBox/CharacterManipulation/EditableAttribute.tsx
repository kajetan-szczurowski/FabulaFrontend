import { AttributeEditType, editSignal } from "./EditAttributeDialog"
import { translate } from "../../../Dictionaries/translate";

export default function EditableAttribute({text, maxLength, attributesGroup = '', attributeID = '',  attributeSection = '', title = undefined, multiline = false}:AttributeEditType) {
  return(
    <span onClick={handleClick} className="clickable-editable">
       {translate(text)}
    </span>
  )
  function handleClick() {  
    editSignal.value = {text: text, maxLength: maxLength, attributesGroup: attributesGroup,
      attributeID: attributeID, attributeSection:attributeSection,  title: title, multiline: multiline};
  }
}

