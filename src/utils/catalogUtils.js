/**
 * Общие утилиты для каталога и фильтров (Catalog, Header).
 */

export function getErasFromCreationTime(creationTime) {
  if (!creationTime) return []
  const match = String(creationTime).match(/\d{4}/)
  const year = match ? parseInt(match[0], 10) : null
  if (year === null) return []
  const eras = []
  if (year < 1800) eras.push('XVIII век')
  if (year >= 1800 && year < 1900) eras.push('XIX век')
  if (year >= 1760 && year <= 1840) eras.push('Эпоха классицизма')
  return eras
}

export function matchesSearch(item, query) {
  if (!query || !query.trim()) return true
  const q = query.trim().toLowerCase()
  const searchIn = [
    item.name,
    item.title,
    item.sculptor,
    item.location,
    item.creationTime,
    item.tombstoneType,
    ...(Array.isArray(item.texts) ? item.texts : []),
    item.historyCreation || '',
  ].filter(Boolean).join(' ')
  return searchIn.toLowerCase().includes(q)
}
