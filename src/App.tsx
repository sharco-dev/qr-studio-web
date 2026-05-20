import { useState } from 'react'
import './App.css'
import { Topbar } from './components/topbar/Topbar'
import { Sidebar } from './components/sidebar/Sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Topbar />
      <div className="app__layout">
        <Sidebar />
      </div>
    </div>
  )
}

export default App
