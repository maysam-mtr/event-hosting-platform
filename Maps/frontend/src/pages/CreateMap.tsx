"use client"

/**
 * Create Map Page
 * Provides interface for creating new maps with file uploads
 * Handles form submission and navigation after successful creation
 */

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { useToast } from "../hooks/use-toast"
import { createMap } from "../lib/api"
import MapForm from "../components/MapForm"
import { ArrowLeft } from "lucide-react"
import LogoutButton from "../components/LogoutButton"

export default function CreateMap() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true)

      // Send the form data directly to the API
      await createMap(formData)

      toast({
        title: "Success",
        description: "Map created successfully!",
      })

      navigate("/")
    } catch (error) {
      console.error("Error creating map:", error)
      toast({
        title: "Error",
        description: "Failed to create map. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link to="/">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Maps
          </Button>
        </Link>
        <LogoutButton />
      </div>
      <h1 className="text-3xl font-bold mb-6">Create New Map</h1>

      <MapForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitButtonText="Create Map" />
    </div>
  )
}
