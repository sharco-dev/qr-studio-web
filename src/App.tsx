import './App.css'
import { Topbar } from './components/topbar/Topbar'
import { Sidebar } from './components/sidebar/Sidebar'
import { EditorCanvas } from './components/canvas/EditorCanvas'
import { ExportPreview } from './components/export/ExportPreview'
import { useEditorStore } from './store/editorStore'

function App() {
  const themeMode = useEditorStore((s) => s.themeMode);

  return (
    <div  className={`app ${themeMode === 'dark' ? 'app--dark' : ''}`}>
      <Topbar />
      <div className="app__layout">
        <Sidebar />
        <EditorCanvas />
      </div>
      <ExportPreview />
    </div>
  )
}

export default App
