
import ElementsList from './ElementsList';
import { withInputFilter } from '../withInputFilter';
import { elementType } from '../../types/characterTypes';
import { editSignal } from './CharacterManipulation/EditAttributeDialog';
import { translate } from '../../Dictionaries/translate';

export default function CharacterWindow({data, attributeGroup}: props) {
  if (!data) return (<></>)
  // if (data.length === 0) return;
  const CharacterComponent = withInputFilter(WindowInside);
  return (

    <div  className = "character-info">
        <CharacterComponent/>
    </div>

  )

  function WindowInside({filter} : {filter: string}){
    if (!data) return (<></>)
    const filtered = data.filter(one => one.label.toLowerCase().includes(filter.toLowerCase()));
    const dataToShow = filter.length > 0? filtered : data;
    return(
      <>
        <button className='character-box-button main-text add-button' onClick = {handleAddNewClick}>{translate('Add new')}</button>
        <ElementsList listOfData={dataToShow} attributeGroup={attributeGroup}/>
      </>
    )
  }

  function handleAddNewClick() {  
    editSignal.value = {text: '', maxLength: 2000, attributesGroup: attributeGroup,
      attributeID: '', attributeSection:'',  title: `new ${attributeGroup}`, multiline: true, newItem: true};
  }

}

type props = {
  data: elementType[],
  attributeGroup: string
}

