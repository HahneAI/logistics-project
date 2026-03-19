import { createContext, useContext, useState, useEffect } from 'react'

const SubsiteContext = createContext(null)

export function SubsiteProvider({ children }) {
  const [subsite,           setSubsite]           = useState(null)
  const [operatorName,      setOperatorName]       = useState('OPERATOR')
  const [shiftStart]                               = useState(new Date())
  const [activeOperatorIdx, setActiveOperatorIdx]  = useState(0)

  // Reset to first operator whenever subsite changes
  useEffect(() => {
    setActiveOperatorIdx(0)
  }, [subsite])

  return (
    <SubsiteContext.Provider value={{
      subsite, setSubsite,
      operatorName, setOperatorName,
      shiftStart,
      activeOperatorIdx, setActiveOperatorIdx,
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
