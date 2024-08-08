import { characterBasicValueType } from '../../types/characterTypes'
import Element from '../CharacterElement/Element'

export default function ElementsList({listOfData, attributeGroup}: props) {
  return (
    <>
     {listOfData.map(item => {
        return(<Element {...item} key = {item.id} attributeGroup={attributeGroup}/>)
     })} 
    </>
  )
}

type props = {
    listOfData : characterBasicValueType[],
    attributeGroup: string
}
