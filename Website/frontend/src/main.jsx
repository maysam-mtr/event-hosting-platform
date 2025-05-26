/**
 * Application Entry Point
 *
 * Main entry file that initializes the React application:
 * - React DOM rendering and root element mounting
 * - Global context providers setup (UserState, Theme)
 * - Router configuration and route initialization
 * - Global CSS and styling imports
 * - Application-wide error boundary setup
 *
 * Bootstraps the entire frontend application and sets up
 * the foundation for all components and pages.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
