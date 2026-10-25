import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from "buffer";


import './index.css'
import './i18n.js'
import App from './App.jsx'

window.Buffer = Buffer;


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
