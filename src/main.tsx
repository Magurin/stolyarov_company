import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Строку import './index.css' мы удалили, так как файла нет
import App from './App' // Убрали .js, Vite сам найдет .tsx файл

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)