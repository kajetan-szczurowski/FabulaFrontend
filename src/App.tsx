import CharacterBox from './assets/components/CharacterBox/CharacterBox';
import Chat from './assets/components/Chat/Chat';
import Map from './assets/components/Map/Map';
import { SocketProvider } from './assets/providers/SocketProvider';
import Settings from './assets/components/CharacterBox/Settings';
import GlobalState from './assets/states/GlobalState';
import CombatBox from './assets/components/CombatBox/CombatBox';


function App() {

  return (
      <SocketProvider>
      <GlobalState />

        <main>
        <section id = "left-side">
          {/* <Map/> */}
          <CombatBox/>
          <Chat/>
        </section>

        <CharacterBox/>
        <Settings/>
        </main>
      </SocketProvider>
    
  )

}


export default App

