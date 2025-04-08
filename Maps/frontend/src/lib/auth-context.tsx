import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { checkAuth } from "./api"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  setIsAuthenticated: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const { statusCode } = await checkAuth()
        setIsAuthenticated(statusCode === 200)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthentication()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, setIsAuthenticated }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

