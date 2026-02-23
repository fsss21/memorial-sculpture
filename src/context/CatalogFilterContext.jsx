import { createContext, useContext, useState, useMemo } from 'react'

const CatalogFilterContext = createContext(null)

export function CatalogFilterProvider({ children }) {
  const [selectedSculptors, setSelectedSculptors] = useState([])
  const [selectedEras, setSelectedEras] = useState([])
  const [selectedMaterials, setSelectedMaterials] = useState([])
  const [selectedTombstoneTypes, setSelectedTombstoneTypes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const value = useMemo(
    () => ({
      selectedSculptors,
      setSelectedSculptors,
      selectedEras,
      setSelectedEras,
      selectedMaterials,
      setSelectedMaterials,
      selectedTombstoneTypes,
      setSelectedTombstoneTypes,
      searchQuery,
      setSearchQuery,
    }),
    [
      selectedSculptors,
      selectedEras,
      selectedMaterials,
      selectedTombstoneTypes,
      searchQuery,
    ]
  )

  return (
    <CatalogFilterContext.Provider value={value}>
      {children}
    </CatalogFilterContext.Provider>
  )
}

export function useCatalogFilter() {
  const ctx = useContext(CatalogFilterContext)
  if (!ctx) {
    throw new Error('useCatalogFilter must be used within CatalogFilterProvider')
  }
  return ctx
}
