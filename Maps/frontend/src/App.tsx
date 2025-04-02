import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import CreateMap from "./pages/CreateMap"
import UpdateMap from "./pages/UpdateMap"
import LatestMaps from "./pages/LatestMaps"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./lib/auth-context"

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateMap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update/:id"
          element={
            <ProtectedRoute>
              <UpdateMap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/latest"
          element={
            <ProtectedRoute>
              <LatestMaps />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App