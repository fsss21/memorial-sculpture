/**
 * Общие утилиты для каталога и фильтров (Catalog, Header).
 */

export function getErasFromCreationTime(creationTime) {
  if (!creationTime) return []
  const str = String(creationTime).trim()
  const eras = []
  // Текстовые обозначения эпох (напр. "Нач. XIX в.", "XIX в.")
  if (/\bXIX\b/i.test(str)) {
    eras.push('XIX век')
    eras.push('Эпоха классицизма')
  }
  if (/\bXVIII\b/i.test(str)) {
    eras.push('XVIII век')
    eras.push('Эпоха классицизма')
  }
  // Год из числа (первое вхождение 4 цифр подряд)
  const match = str.match(/\d{4}/)
  const year = match ? parseInt(match[0], 10) : null
  if (year !== null) {
    if (year < 1800 && !eras.includes('XVIII век')) eras.push('XVIII век')
    if (year >= 1800 && year < 1900 && !eras.includes('XIX век')) eras.push('XIX век')
    if (year >= 1760 && year <= 1840 && !eras.includes('Эпоха классицизма')) eras.push('Эпоха классицизма')
  }
  return [...new Set(eras)]
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
