import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCatalogFilter } from '../../context/CatalogFilterContext'
import Header from '../../components/Header/Header'
import { getErasFromCreationTime, matchesSearch } from '../../utils/catalogUtils'
import styles from './Catalog.module.css'
import catalogImg from '../../assets/catalog_img.png'
import catalogImg4k from '../../assets/catalog_img-4k.png'
import placeHolderOne from '../../assets/place_holder_img_one.png'
import placeHolderTwo from '../../assets/place_holder_img_two.png'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const IMAGE_URL_MAP = {
  place_holder_one: placeHolderOne,
  place_holder_two: placeHolderTwo,
}

function Catalog() {
  const navigate = useNavigate()
  const {
    selectedSculptors,
    selectedEras,
    selectedMaterials,
    selectedTombstoneTypes,
    searchQuery,
  } = useCatalogFilter()
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [imageSrc, setImageSrc] = useState(catalogImg)
  const [items, setItems] = useState([])

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? catalogImg4k : catalogImg)

    fetch('/data/catalogItems.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(data => setItems(data))
      .catch(err => console.error('Error loading catalog items:', err))
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedSculptors.length > 0 && !selectedSculptors.includes(item.sculptor)) return false
      if (selectedEras.length > 0) {
        const itemEras = getErasFromCreationTime(item.creationTime)
        if (!selectedEras.some((era) => itemEras.includes(era))) return false
      }
      if (selectedMaterials.length > 0) {
        const material = item.material || ''
        if (!selectedMaterials.includes(material)) return false
      }
      if (selectedTombstoneTypes.length > 0) {
        const type = item.tombstoneType || ''
        if (!selectedTombstoneTypes.includes(type)) return false
      }
      if (!matchesSearch(item, searchQuery)) return false
      return true
    })
  }, [
    items,
    selectedSculptors,
    selectedEras,
    selectedMaterials,
    selectedTombstoneTypes,
    searchQuery,
  ])

  useEffect(() => {
    setCurrentItemIndex((prev) => Math.min(prev, Math.max(0, filteredItems.length - 1)))
  }, [filteredItems.length])

  const handleNextItem = () => {
    if (filteredItems.length === 0) return
    setCurrentItemIndex((prev) => (prev + 1) % filteredItems.length)
  }

  const handlePrevItem = () => {
    if (filteredItems.length === 0) return
    setCurrentItemIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
  }

  const handleItemClick = (item) => {
    navigate(`/catalog/${item.id}`)
  }

  const handleBack = () => {
    navigate('/')
  }

  const getItemImageSrc = (item) => {
    if (item.imageKey && IMAGE_URL_MAP[item.imageKey]) return IMAGE_URL_MAP[item.imageKey]
    if (item.photos && item.photos.length > 0) return item.photos[0]
    return IMAGE_URL_MAP.place_holder_one
  }

  const len = filteredItems.length
  const prevIndex = (currentItemIndex - 1 + len) % len
  const nextIndex = (currentItemIndex + 1) % len
  const centerItem = filteredItems[currentItemIndex] || null
  const prevItem =
    len > 1 && prevIndex !== currentItemIndex && prevIndex !== nextIndex
      ? filteredItems[prevIndex]
      : null
  const nextItem =
    len > 1 && nextIndex !== currentItemIndex ? filteredItems[nextIndex] : null

  return (
    <div className={styles.catalog}>
      <div
        className={styles.catalogBackground}
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <Header />
      <div className={styles.catalogContent}>
        <div className={styles.catalogCenter}>
          {filteredItems.length === 0 ? (
            <p className={styles.catalogEmpty}>
              По вашему запросу ничего не найдено. Измените фильтры или поиск.
            </p>
          ) : (
            <div className={styles.catalogCarousel}>
              <button
                type="button"
                className={styles.catalogArrow}
                onClick={handlePrevItem}
                disabled={filteredItems.length === 0}
                aria-label="Предыдущий предмет"
              >
                <ArrowBackIosNewIcon />
              </button>

              <div className={styles.catalogCarouselSlots}>
                <div className={`${styles.catalogCarouselSlot} ${styles.catalogCarouselSlotLeft}`}>
                  {prevItem && (
                    <div
                      className={styles.catalogItem}

                      role="button"
                      tabIndex={0}

                    >
                      <div className={styles.catalogItemImage}>
                        <img src={getItemImageSrc(prevItem)} alt={prevItem.name} />
                      </div>
                      <div className={styles.catalogItemCaption}>
                        <div className={styles.catalogItemTitle}>{prevItem.name || prevItem.title}</div>
                        {prevItem.sculptor && (
                          <div className={styles.catalogItemMeta}>{prevItem.sculptor}</div>
                        )}
                        {prevItem.creationTime && (
                          <div className={styles.catalogItemMeta}>{prevItem.creationTime}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className={`${styles.catalogCarouselSlot} ${styles.catalogCarouselSlotCenter}`}>
                  {centerItem && (
                    <div
                      className={`${styles.catalogItem} ${styles.catalogItemActive}`}
                      onClick={() => handleItemClick(centerItem)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleItemClick(centerItem)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.catalogItemImage}>
                        <img src={getItemImageSrc(centerItem)} alt={centerItem.name} />
                      </div>
                      <div className={styles.catalogItemCaption}>
                        <div className={styles.catalogItemTitle}>{centerItem.name || centerItem.title}</div>
                        {centerItem.sculptor && (
                          <div className={styles.catalogItemMeta}>{centerItem.sculptor}</div>
                        )}
                        {centerItem.creationTime && (
                          <div className={styles.catalogItemMeta}>{centerItem.creationTime}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className={`${styles.catalogCarouselSlot} ${styles.catalogCarouselSlotRight}`}>
                  {nextItem && (
                    <div
                      className={styles.catalogItem}

                      role="button"
                      tabIndex={0}

                    >
                      <div className={styles.catalogItemImage}>
                        <img src={getItemImageSrc(nextItem)} alt={nextItem.name} />
                      </div>
                      <div className={styles.catalogItemCaption}>
                        <div className={styles.catalogItemTitle}>{nextItem.name || nextItem.title}</div>
                        {nextItem.sculptor && (
                          <div className={styles.catalogItemMeta}>{nextItem.sculptor}</div>
                        )}
                        {nextItem.creationTime && (
                          <div className={styles.catalogItemMeta}>{nextItem.creationTime}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                className={styles.catalogArrow}
                onClick={handleNextItem}
                disabled={filteredItems.length === 0}
                aria-label="Следующий предмет"
              >
                <ArrowForwardIosIcon />
              </button>
            </div>
          )}

        </div>

        <div className={styles.catalogBottomNavigation}>
          <button type="button" className={styles.catalogBackBtn} onClick={handleBack}>
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}

export default Catalog
