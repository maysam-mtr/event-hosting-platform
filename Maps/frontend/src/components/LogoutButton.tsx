"use client"

/**
 * Logout Button Component
 * Handles user logout with proper error handling and navigation
 */

import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { logout } from "../lib/api"
import { useAuth } from "../lib/auth-context"
import { useToast } from "../hooks/use-toast"

export default function LogoutButton() {
  const navigate = useNavigate()
  const { setIsAuthenticated } = useAuth()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      setIsAuthenticated(false)
      toast({
        title: "Success",
        description: "You have been logged out successfully.",
      })
      navigate("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} className="ml-2">
      <LogOut className="mr-2 h-4 w-4" /> Logout
    </Button>
  )
}
