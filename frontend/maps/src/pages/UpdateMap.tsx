"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { useToast } from "../hooks/use-toast"
import { getMapById, updateMap } from "../lib/api"
import MapForm from "../components/MapForm"
import { ArrowLeft } from "lucide-react"
import type { Map } from "../lib/types"

export default function UpdateMap() {
  const { id } = useParams<{ id: string }>()
  const [map, setMap] = useState<Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchMap = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const response = await getMapById(id)
        setMap(response.data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch map details. Please try again later.",
          variant: "destructive",
        })
        navigate("/")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMap()
  }, [id, navigate, toast])

  const handleSubmit = async (formData: FormData) => {
    if (!map || !id) return

    try {
      setIsSubmitting(true)

      // Add original map ID to form data
      formData.append("original_map_id", map.original_map_id || map.id)

      // Send the form data directly to the API
      await updateMap(id, formData)

      toast({
        title: "Success",
        description: "Map updated successfully!",
      })

      navigate("/")
    } catch (error) {
      console.error("Error updating map:", error)
      toast({
        title: "Error",
        description: "Failed to update map. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 w-64 bg-gray-200 rounded mb-8"></div>
          <div className="h-96 bg-gray-100 rounded"></div>
        </div>
      </div>
    )
  }

  if (!map) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Map Not Found</h1>
        <p className="mb-6">The map you're looking for doesn't exist or has been deleted.</p>
        <Link to="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Maps
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Maps
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Update Map: {map.name}</h1>
      </div>

      <MapForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitButtonText="Update Map" initialData={map} />
    </div>
  )
}