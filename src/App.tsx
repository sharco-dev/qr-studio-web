import './App.css'
import { Topbar } from './components/topbar/Topbar'
import { Sidebar } from './components/sidebar/Sidebar'
import { EditorCanvas } from './components/canvas/EditorCanvas'

function App() {

  return (
    <div>
      <Topbar />
      <div className="app__layout">
        <Sidebar />
        <EditorCanvas />
      </div>
    </div>
  )
}

export default App
