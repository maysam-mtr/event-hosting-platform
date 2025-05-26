import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const script = document.createElement('script')
const JITSI_DOMAIN = import.meta.env.VITE_JITSI_DOMAIN
script.src = `https://${JITSI_DOMAIN}/external_api.js`
script.async = true
document.body.appendChild(script)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
