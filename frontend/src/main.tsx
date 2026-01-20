import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/styles/index.css'
import { AuthProvider } from './app/context/AuthContext'
import { DataProvider } from './app/context/DataContext'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DataProvider>
      <App />
      </DataProvider>
    </AuthProvider>
  </StrictMode>,
)
