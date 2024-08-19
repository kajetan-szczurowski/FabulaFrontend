import { characterBasicValueType } from "../../types/characterTypes";
import EditableAttribute from "./CharacterManipulation/EditableAttribute";

export default function ListWithHeader({header, data, maxLength, attributeGroup, sectionClassName = 'list-section', disableDelete = false, liClass = 'text-left'}: props) {
  const DEFAULT_MAX_INPUT_LENGTH = 30;
  const MAX_INPUT_LENGTH_FOR_LABEL = 100;
  if (!data) return(<></>)
  if (!Array.isArray(data)) return(<></>)

  return (
    <section>
        {header && <div>{header}</div>}
        <ul className={sectionClassName}>
            {data.map(input => {
              const containLetters = /[a-zA-Z]+/g.test(String(input.description));
              const contentPayload = {text: input.description, label: input.label, id: input.id, socketOrderSuffix: 'description'};
              const headerPayload = {text: input.label, label: input.label, id: input.id, socketOrderSuffix: 'label'};
              return(
                <li key = {input.id} className={liClass}>
                  <strong><Content {...headerPayload} customMaxLength={MAX_INPUT_LENGTH_FOR_LABEL} /></strong> 
                  {!containLetters && <em className = 'numeric-value'><Content {...contentPayload} /></em>}
                  {containLetters && <em><Content {...contentPayload} /></em>}
                </li>)})}
        </ul>
    </section>
  )

  function Content({text, label, socketOrderSuffix, id, customMaxLength}: contentProps){
    const socketOrder = {attributesGroup: attributeGroup, attributeID: id, attributeSection: socketOrderSuffix};
    const length = customMaxLength || maxLength || DEFAULT_MAX_INPUT_LENGTH;
    return(
      <EditableAttribute text = {text} maxLength={length} title = {label} {...socketOrder} disableDelete = {disableDelete} />
    )
  }
}

type contentProps = {
  text: string,
  label: string,
  id: string,
  socketOrderSuffix: string,
  customMaxLength?: number
}

type props = {
    header?: string,
    maxLength?: number,
    attributeGroup: string,
    data: characterBasicValueType[],
    sectionClassName? :string,
    disableDelete?: boolean,
    liClass?: string
}