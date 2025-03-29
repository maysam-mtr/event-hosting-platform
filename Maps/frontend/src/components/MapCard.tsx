import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Edit, Trash2, Download } from "lucide-react"
import { Link } from "react-router-dom"
import type { Map } from "../lib/types"
import { formatDate } from "../lib/utils"

interface MapCardProps {
  map: Map
  onDeleteClick: () => void
}

export default function MapCard({ map, onDeleteClick }: MapCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="truncate" title={map.name}>
          {map.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <div className="relative h-40 w-full">
          <img
            src={
              map.imageId
                ? `https://drive.google.com/thumbnail?id=${map.imageId}&sz=w320-h160`
                : `/image-placeholder.jpg`
            }
            alt={map.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if the image fails to load
              const target = e.target as HTMLImageElement
              target.src = `/image-placeholder.jpg`
            }}
          />
        </div>
        <div className="p-4">
          <div className="text-sm text-muted-foreground mb-1">
            <span className="font-semibold">ID:</span> {map.id.substring(0, 8)}...
          </div>
          {map.original_map_id && (
            <div className="text-sm text-muted-foreground mb-1">
              <span className="font-semibold">Original ID:</span> {map.original_map_id.substring(0, 8)}...
            </div>
          )}
          <div className="text-sm text-muted-foreground mb-1">
            <span className="font-semibold">Created:</span> {formatDate(map.created_at)}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold">Updated:</span> {formatDate(map.updated_at)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-2 border-t">
        <div className="flex space-x-2 w-full">
          <Link to={`/update/${map.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault()
              window.location.href = `/api/maps/downloadMap/${map.id}`
            }}
          >
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          <Button variant="destructive" className="flex-1" onClick={onDeleteClick}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

