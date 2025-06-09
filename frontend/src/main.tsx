import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import Router from './router/index.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { OrderingStatusProvider } from './context/OrderingStatusContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <OrderingStatusProvider>
          <Router />
        </OrderingStatusProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
