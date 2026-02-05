import { Navbar } from './components/Navbar'
import { OneStatement } from './components/OneStatement'

function App() {
  return (
    <div id="app-body" className="antialiased selection:bg-black/10 selection:text-black/80 relative overflow-x-hidden">
      <Navbar />
      <OneStatement />
    </div>
  )
}

export default App
