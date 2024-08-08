import ListWithHeader from './ListWithHeader'
import { characterData } from './CharacterBox';

export default function About() {
  const aboutData = characterData.value?.about;
  if (!aboutData) return (<></>);
  if (aboutData.length === 0) return;
  return (

    <div  className = "character-info">
      <div className = 'about-box'>
        <div className = 'about-text'>
          <h1>{characterData.value?.name}</h1>
            <img src= {characterData.value?.graphicUrl ?? 'https://s13.gifyu.com/images/S0Ird.png'} className = 'about-portrait'/>
            <ListWithHeader data = {aboutData} attributeGroup='about' maxLength={1000}/>

        </div>
      </div>
    </div>

  )


}

