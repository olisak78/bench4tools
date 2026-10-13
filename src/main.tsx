import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Layout } from './components/layout/Layout'
import { Base64Page } from './pages/Base64Page'
import { HomePage } from './pages/HomePage'
import { JsonFormatterPage } from './pages/JsonFormatterPage'
import { JwtDecoderPage } from './pages/JwtDecoderPage'
import { NotFoundPage } from './pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'json-formatter', element: <JsonFormatterPage /> },
      { path: 'jwt-decoder', element: <JwtDecoderPage /> },
      { path: 'base64-encode-decode', element: <Base64Page /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
