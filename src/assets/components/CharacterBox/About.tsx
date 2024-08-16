import ListWithHeader from './ListWithHeader'
import { characterData } from './CharacterBox';
import { characterBasicValueType } from '../../types/characterTypes';

export default function About() {
  const aboutData = characterData.value?.about;
  if (!aboutData) return (<></>);
  if (aboutData.length === 0) return;

  const [dataBatches, unorgonizedData] = getBatchedProperties(aboutData);
  let firstBatchIterated = false;

  return (

    <div  className = "character-info">
      <div className = 'about-box'>
        <div className = 'about-text'>
          <div className = 'about-header'>
            <div>
              <h1>{characterData.value?.name}</h1>
              <ListWithHeader data = {dataBatches[0]} attributeGroup='about' maxLength={1000}/>
            </div>

            <img src= {characterData.value?.graphicUrl ?? 'https://s13.gifyu.com/images/S0Ird.png'} className = 'about-portrait'/>
          </div>
          <hr/>

          {dataBatches.map(batch => {
            if (!firstBatchIterated) {
              firstBatchIterated = true;
              return (<></>)
            }

            return(
            <>
              <ListWithHeader data = {batch} attributeGroup='about' maxLength={1000}/>
              <hr/>
            </>
              )
          })}

        </div>
      </div>
    </div>

  )


}

function getBatchedProperties(data: characterBasicValueType[]): [characterBasicValueType[][], characterBasicValueType[]]{
  const batchMap = [['pronounce', 'identity', 'origin', 'theme'], ['level', 'classes'], 
  ['agility', 'power', 'will', 'inside'], ['fabulaPoints', 'initiative', 'armor', 'magicalDefence'] ];

  const prepedBatches: characterBasicValueType[][] = [];
  batchMap.forEach(group => prepedBatches.push([]));
  const leftover = data.map(prop => {
    for (let index = 0; index < batchMap.length; index++){
      if (batchMap[index].includes(prop.label)){
        prepedBatches[index].push(prop);
        return;
      }
    }
    return prop;
  }).filter(prop => prop) as characterBasicValueType[];

  return [prepedBatches, leftover];
}
