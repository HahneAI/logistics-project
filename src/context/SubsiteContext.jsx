import { createContext, useContext, useState, useEffect } from 'react'

const SubsiteContext = createContext(null)

export function SubsiteProvider({ children }) {
  const [subsite,           setSubsite]           = useState(null)
  const [operatorName,      setOperatorName]       = useState('OPERATOR')
  const [shiftStart]                               = useState(new Date())
  const [activeOperatorIdx, setActiveOperatorIdx]  = useState(0)
  const [agvTechMode,       setAgvTechMode]        = useState(false)
  const [agvDebugTarget,    setAgvDebugTarget]     = useState(null) // { id, status } of faulted node

  // Reset operator index when subsite changes
  useEffect(() => {
    setActiveOperatorIdx(0)
  }, [subsite])

  // Clear debug target when tech mode is toggled off
  useEffect(() => {
    if (!agvTechMode) setAgvDebugTarget(null)
  }, [agvTechMode])

  return (
    <SubsiteContext.Provider value={{
      subsite, setSubsite,
      operatorName, setOperatorName,
      shiftStart,
      activeOperatorIdx, setActiveOperatorIdx,
      agvTechMode, setAgvTechMode,
      agvDebugTarget, setAgvDebugTarget,
    }}>
      {children}
    </SubsiteContext.Provider>
  )
}

export function useSubsite() {
  const ctx = useContext(SubsiteContext)
  if (!ctx) throw new Error('useSubsite must be used inside SubsiteProvider')
  return ctx
}
