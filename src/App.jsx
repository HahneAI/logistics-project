import { useState } from 'react'
import { SubsiteProvider } from './context/SubsiteContext.jsx'
import BootScreen from './components/BootScreen.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const [booted, setBooted] = useState(false)

  return (
    <SubsiteProvider>
      <div className="relative min-h-screen bg-bg-primary">
        <div className="scanlines fixed inset-0 z-50 pointer-events-none" />
        {booted ? (
          <Dashboard onLogout={() => setBooted(false)} />
        ) : (
          <BootScreen onBoot={() => setBooted(true)} />
        )}
      </div>
    </SubsiteProvider>
  )
}
