/**
 * Main Application Component
 *
 * Root component that sets up the entire React application structure
 * Handles:
 * - Global state management with UserStateProvider
 * - React Router configuration for navigation
 * - Application-wide context providers
 * - Route rendering and component mounting
 */

import { RouterProvider } from "react-router-dom";
import {Router} from "./router/router";
import { UserProvider } from "./contexts/user-state-context";

function App() {

  return (
    <>
      <UserProvider>
        <RouterProvider router={Router} />
      </UserProvider>
    </>
  )
}

export default App

