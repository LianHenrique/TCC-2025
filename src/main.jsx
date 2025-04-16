import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import MyRouter from './Routes/MyRouter'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={MyRouter} />
  </StrictMode>,
)
