import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PhotoGallery from '../../components/PhotoGallery/PhotoGallery'
import Header from '../../components/Header/Header'
import styles from './CatalogItem.module.css'
import catalogItemImg from '../../assets/catalog_item_img.png'
import catalogItemImg4k from '../../assets/catalog_item_img-4k.png'
import placeHolderOne from '../../assets/place_holder_img_one.png'
import placeHolderTwo from '../../assets/place_holder_img_two.png'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

const IMAGE_URL_MAP = {
  place_holder_one: placeHolderOne,
  place_holder_two: placeHolderTwo,
}

function CatalogItem() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [imageSrc, setImageSrc] = useState(catalogItemImg)

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? catalogItemImg4k : catalogItemImg)

    setLoading(true)
    setNotFound(false)
    fetch('/data/catalogItems.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(data => {
        const foundItem = data.find(i => i.id === parseInt(id, 10))
        setItem(foundItem ?? null)
        setNotFound(!foundItem)
        setCurrentPhotoIndex(0)
        setCurrentTextIndex(0)
      })
      .catch(err => {
        console.error('Error loading catalog item:', err)
        setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleBack = () => {
    navigate('/catalog')
  }

  const handleFullscreen = () => {
    setShowFullscreen(true)
  }

  const handleCloseFullscreen = () => {
    setShowFullscreen(false)
  }

  const handleNextPhoto = () => {
    const photos = getItemImages()
    if (photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
    }
  }

  const handlePrevPhoto = () => {
    const photos = getItemImages()
    if (photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
    }
  }

  const handleNextText = () => {
    if (historyPages.length > 0 && currentTextIndex < historyPages.length - 1) {
      setCurrentTextIndex((prev) => prev + 1)
    }
  }

  const handlePrevText = () => {
    if (currentTextIndex > 0) {
      setCurrentTextIndex((prev) => prev - 1)
    }
  }

  const getItemImages = () => {
    if (!item) return []
    if (item.imageKey && IMAGE_URL_MAP[item.imageKey]) {
      return [IMAGE_URL_MAP[item.imageKey]]
    }
    return item.photos || []
  }

  if (loading) {
    return (
      <div className={styles.catalogItemPage}>
        <Header />
        <div className={styles.catalogItemContent}>
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  if (notFound || !item) {
    return (
      <div className={styles.catalogItemPage}>
        <Header />
        <div className={styles.catalogItemContent}>
          <p>Произведение не найдено.</p>
          <button type="button" className={styles.catalogItemBackLink} onClick={() => navigate('/catalog')}>
            Вернуться в каталог
          </button>
        </div>
      </div>
    )
  }

  const currentPhotos = getItemImages()

  const historyPages = [
    item.historyCreation && { title: 'Краткая история создания', content: item.historyCreation },
    item.biography && {
      title: 'Биография погребённого и его роль в истории',
      content: item.biography,
    },
    item.orderCircumstances && {
      title: 'Обстоятельства заказа и создания надгробия',
      content: item.orderCircumstances,
    },
    item.artisticFeatures && {
      title: 'Художественные особенности и символика',
      content: item.artisticFeatures,
    },
    item.fate && {
      title: 'Судьба надгробия и причины поступления в музей',
      content: item.fate,
    },
  ].filter(Boolean)

  const currentPage = historyPages[currentTextIndex]

  return (
    <div className={styles.catalogItemPage}>
      <div
        className={styles.catalogItemBackground}
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <Header />
      <div className={styles.catalogItemContent}>
        <div className={styles.catalogItemMain}>
          <div className={styles.catalogItemTextBlock}>
            <h1 className={styles.catalogItemName}>{item.name}</h1>
            <div className={styles.catalogItemInfoBlock}>
              {item.sculptor && (
                <div className={styles.catalogItemInfoRow}>
                  <span className={styles.catalogItemInfoLabel}>Скульптор:</span>
                  <span className={styles.catalogItemInfoValue}>{item.sculptor}</span>
                </div>
              )}

              {item.creationTime && (
                <div className={styles.catalogItemInfoRow}>
                  <span className={styles.catalogItemInfoLabel}>Время создания:</span>
                  <span className={styles.catalogItemInfoValue}>{item.creationTime}</span>
                </div>
              )}

              {item.location && (
                <div className={styles.catalogItemInfoRow}>
                  <span className={styles.catalogItemInfoLabel}>Где была установлена:</span>
                  <span className={styles.catalogItemInfoValue}>{item.location}</span>
                </div>
              )}
            </div>
            <div className={styles.catalogItemHistorySection}>
              {historyPages.length > 0 && currentPage ? (
                <>
                  <h3 className={styles.catalogItemHistoryPageTitle}>{currentPage.title}</h3>
                  <p className={styles.catalogItemDescription}>{currentPage.content}</p>

                </>
              ) : (
                item.historyCreation && (
                  <p className={styles.catalogItemDescription}>{item.historyCreation}</p>
                )
              )}
            </div>
            {historyPages.length > 1 && (
              <div className={styles.catalogItemTextNavigation}>
                <span className={styles.catalogItemTextCounter}>
                  {currentTextIndex + 1} / {historyPages.length}
                </span>
                <div className={styles.catalogItemTextNavBtns}>
                  <button
                    type="button"
                    className={styles.catalogItemTextNavBtn}
                    onClick={handlePrevText}
                    disabled={currentTextIndex === 0}
                    aria-label="Предыдущий раздел"
                  >
                    <ArrowBackIosNewIcon />
                  </button>
                  <button
                    type="button"
                    className={styles.catalogItemTextNavBtn}
                    onClick={handleNextText}
                    disabled={currentTextIndex === historyPages.length - 1}
                    aria-label="Следующий раздел"
                  >
                    <ArrowForwardIosIcon />
                  </button>
                </div>
              </div>
            )}
          </div>

          {currentPhotos.length > 0 && (
            <div className={styles.catalogItemPhotoBlock}>
              <div className={styles.catalogItemGallery}>
                <PhotoGallery
                  photos={currentPhotos}
                  showFullscreen={showFullscreen}
                  onCloseFullscreen={handleCloseFullscreen}
                  showControls={false}
                  showArrows={false}
                  currentIndex={currentPhotoIndex}
                  onIndexChange={setCurrentPhotoIndex}
                />
              </div>
              <div className={styles.catalogItemPhotoNavigation}>
                <button
                  className={styles.catalogItemPhotoNavBtn}
                  onClick={handlePrevPhoto}
                  disabled={currentPhotos.length <= 1}
                  aria-label="Предыдущее фото"
                >
                  <ArrowBackIosNewIcon />
                </button>
                <div className={styles.catalogItemPhotoCounter}>
                  {currentPhotoIndex + 1} / {currentPhotos.length}
                </div>
                <button
                  className={styles.catalogItemPhotoNavBtn}
                  onClick={handleNextPhoto}
                  disabled={currentPhotos.length <= 1}
                  aria-label="Следующее фото"
                >
                  <ArrowForwardIosIcon />
                </button>
                <button
                  className={styles.catalogItemFullscreenBtn}
                  onClick={handleFullscreen}
                  aria-label="Полноэкранный режим"
                >
                  <FullscreenIcon fontSize="large" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CatalogItem
