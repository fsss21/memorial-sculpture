# Классический Петербург (Memorial Sculpture)
**01.31 мемориальная скульптура** 
Проект на **React** с **CSS Modules** и Vite.

## Стек

- React 18
- React Router
- Vite
- CSS Modules (`*.module.css`)
- MUI (Material UI) — иконки и компоненты

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
npm run preview
```

## Структура

- `src/` — исходный код (компоненты, страницы, контекст)
- `src/**/*.module.css` — стили в формате CSS Modules
- `public/data/` — JSON: `catalogItems.json`, `progressPoints.json`
- `src/assets/` — изображения (см. `src/assets/README.md`)

Перед первым запуском добавьте в `src/assets/` нужные изображения (список в `src/assets/README.md`), иначе сборка не пройдёт из‑за отсутствующих импортов.
