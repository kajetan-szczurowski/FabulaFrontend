import { withChangeClassOnClick } from '../withChangeClassOnClick';
import { SetStateAction } from 'react';
import { elementType } from '../../types/characterTypes';
import EditableAttribute from '../CharacterBox/CharacterManipulation/EditableAttribute';
import { useSocket } from '../../providers/SocketProvider';
import { usersDataState } from '../../states/GlobalState';
import { translate } from '../../Dictionaries/translate';

export default function Element({investedPoints, label, id, description, attributeGroup, magicCost, duration, target}: elementType & props) {
    const socket = useSocket();
    const userID = usersDataState.value.userID;
    const characterID = usersDataState.value.currentCharacterID;
    const Component = withChangeClassOnClick(Header, BodyExpandableWrapper, id);
    const MAX_LENGTH_HEADER = 100;
    const MAX_LENGTH_DESCRIPTION = 2000;
    const showInvestedPoints = setInvestedPointsVisibility(investedPoints);
  return (
    <>
    <Component />
    </>
  )

  function Header({clicked, setClicked}: toClickType){
    const socketOrder = {attributesGroup: attributeGroup, attributeID: id, attributeSection: 'label'};
    return(
    <div>
        <h2 className = 'item-label'>
        <div><EditableAttribute text = {label} maxLength={MAX_LENGTH_HEADER} title = {label} {...socketOrder} /></div>
          <div className={`visibility-controll-clicked-${clicked} visibility-controll character-box-clickable`} style = {{background: 'none'}} onClick = {function(){setClicked(prev => !prev)}}>v</div>
        </h2>
    </div>
  )}

  function BodyExpandableWrapper({clicked}: toClickType){
    return(
      <div className={`visible-${clicked}`}>
        <ComponentBody />
      </div>
    )
  }

  function ComponentBody(){
    const socketOrder = {attributesGroup: attributeGroup, attributeID: id, attributeSection: 'description'};

    return(
    <>
      <div className = 'skill-level-header hr'>
      {showInvestedPoints && <div>Poziom umiejętności:</div>}

      {showInvestedPoints && <InvestedPointsComponent/>}
      <SpellHeader/>

      </div>
      <div className = 'item-value'><EditableAttribute text = {description} maxLength={MAX_LENGTH_DESCRIPTION} title = {label} {...socketOrder}  multiline = {true}/></div>
      </>
    )
  }

  function InvestedPointsComponent(){
    return(
        <div>
    <       button className="character-box-clickable character-box-button" onClick = {handleMinusClick}>-</button>
            <span>{investedPoints}</span>
            <button className="character-box-clickable character-box-button" onClick = {handlePlusClick}>+</button>
        </div>
    )
  }

  function handleMinusClick(){
    socket.emit('update-invested-points', {userID: userID, characterID: characterID, order: 'decrease', assetID:id})
  }
  function handlePlusClick(){
    socket.emit('update-invested-points', {userID: userID, characterID: characterID, order: 'increase', assetID:id})
  }

  function SpellHeader(){
    if (!magicCost || !duration || !target) return(<></>);
    const socketOrder = {attributesGroup: attributeGroup, attributeID: id};
    return(
        <table className='spell-table'>

          <thead>
            <tr>
              <th className='item-value'>{translate("Magic's cost")}</th>
              <th className='item-value'>{translate('Target')}</th>
              <th className='item-value'>{translate('Duration')}</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              {/* <td className='item-value'>{magicCost}</td> */}
              <td className='item-value'><EditableAttribute text = {magicCost} maxLength={MAX_LENGTH_HEADER} title = {translate("Magic's cost")} attributeSection='magicCost' {...socketOrder}/></td>
              <td className='item-value'><EditableAttribute text = {target} maxLength={MAX_LENGTH_HEADER} title = {translate('Target')} attributeSection='target' {...socketOrder}/></td>
              <td className='item-value'><EditableAttribute text = {duration} maxLength={MAX_LENGTH_HEADER} title = {translate('Duration')} attributeSection='duration' {...socketOrder}/></td>
              {/* <td className='item-value'>{target}</td> */}
              {/* <td className='item-value'>{duration}</td> */}
            </tr>
          </tbody>

        </table>
    )

  }
}

type toClickType = {
    clicked : boolean,
    setClicked : React.Dispatch<SetStateAction<boolean>>
}

type props = {
    attributeGroup: string
}

function setInvestedPointsVisibility(invested: string | undefined | null){
  if (invested === undefined || invested === null) return false;
  return true;
}