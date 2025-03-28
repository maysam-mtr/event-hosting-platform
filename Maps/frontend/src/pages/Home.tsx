"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Search, Plus } from "lucide-react"
import MapCard from "../components/MapCard"
import { useToast } from "../hooks/use-toast"
import { getMaps, deleteMap } from "../lib/api"
import { Link } from "react-router-dom"
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog"
import type { Map } from "../lib/types"

export default function Home() {
  const [maps, setMaps] = useState<Map[]>([])
  const [filteredMaps, setFilteredMaps] = useState<Map[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [mapToDelete, setMapToDelete] = useState<Map | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        setIsLoading(true)
        const response = await getMaps()
        setMaps(response.data)
        setFilteredMaps(response.data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch maps. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaps()
  }, [toast])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMaps(maps)
    } else {
      const filtered = maps.filter((map) => map.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredMaps(filtered)
    }
  }, [searchQuery, maps])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleDeleteClick = (map: Map) => {
    setMapToDelete(map)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!mapToDelete) return

    try {
      await deleteMap(mapToDelete.id)
      setMaps(maps.filter((map) => map.id !== mapToDelete.id))
      toast({
        title: "Success",
        description: `Map "${mapToDelete.name}" has been deleted.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete map. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setMapToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false)
    setMapToDelete(null)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Maps Overview</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search maps by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Link to="/latest" className="flex-1 md:flex-auto">
              <Button variant="outline" className="w-full">
                View Latest Maps
              </Button>
            </Link>
            <Link to="/create" className="flex-1 md:flex-auto">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Create New Map
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-64"></div>
          ))}
        </div>
      ) : filteredMaps.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No maps found</h2>
          <p className="text-gray-500 mb-6">
            {searchQuery ? "No maps match your search criteria." : "Start by creating your first map."}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")} className="mr-2">
              Clear Search
            </Button>
          )}
          <Link to="/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Map
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaps.map((map) => {
            console.log(map);
            return <MapCard key={map.id} map={map} onDeleteClick={() => handleDeleteClick(map)} />;
          })}
        </div>
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        mapName={mapToDelete?.name || ""}
      />
    </main>
  )
}

