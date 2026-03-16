import { createContext, useContext, useState } from 'react'

const SubsiteContext = createContext(null)

export function SubsiteProvider({ children }) {
  const [subsite, setSubsite] = useState(null) // { id, label, shortName, key }
  const [operatorName, setOperatorName] = useState('OPERATOR')
  const [shiftStart] = useState(new Date())

  return (
    <SubsiteContext.Provider value={{ subsite, setSubsite, operatorName, setOperatorName, shiftStart }}>
      {children}
    </SubsiteContext.Provider>
  )
}

export function useSubsite() {
  const ctx = useContext(SubsiteContext)
  if (!ctx) throw new Error('useSubsite must be used inside SubsiteProvider')
  return ctx
}
