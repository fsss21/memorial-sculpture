import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import styles from './MainSection.module.css'
import mainSectionImg from '../../assets/main_section_img.png'
import mainSectionImg4k from '../../assets/main_section_img-4k.png'

const SECTIONS = [
  { id: 'section-one', label: 'Мастерская И.П. Мартоса - классик русского надгробия' },
  { id: 'section-two', label: 'Символика надгробных памятников' },
  { id: 'section-three', label: 'Материалы и техники мемориальной скульптуры' },
  { id: 'section-four', label: 'Некрополи петербурга утраченное наследие' },
  { id: 'section-five', label: 'Эволюция стилей в мемориальном искусстве' },
]

function MainSection() {
  const navigate = useNavigate()
  const [imageSrc, setImageSrc] = useState(mainSectionImg)

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? mainSectionImg4k : mainSectionImg)
  }, [])

  const handleSection = (sectionId) => {
    navigate(`/submenu/${sectionId}`)
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleCatalog = () => {
    navigate('/catalog')
  }

  return (
    <div className={styles.mainSection}>
      <div
        className={styles.mainSectionBackground}
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <Header />
      <div className={styles.mainSectionContent}>
        <div className={styles.mainSectionLeft}>
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={styles.mainSectionBtn}
              onClick={() => handleSection(section.id)}
            >
              {section.label}
            </button>
          ))}
          <button
            type="button"
            className={styles.mainSectionBackBtn}
            onClick={handleBack}
            aria-label="Назад"
          >
            Назад
          </button>
        </div>
        <div className={styles.mainSectionRight}>
          <button
            type="button"
            className={styles.mainSectionCatalogBtn}
            onClick={handleCatalog}
          >
            Узнать подробнее о скульптурах этого зала
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainSection
