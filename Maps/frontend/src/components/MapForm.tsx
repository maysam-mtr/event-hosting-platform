import type React from "react"

import { useState, useRef } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Card, CardContent } from "./ui/card"
import type { Map } from "../lib/types"
import { formatDate } from "../lib/utils"
import FileUploadField from "./FileUploadField"

interface MapFormProps {
  onSubmit: (formData: FormData) => Promise<void>
  isSubmitting: boolean
  submitButtonText: string
  initialData?: Map
}

export default function MapForm({ onSubmit, isSubmitting, submitButtonText, initialData }: MapFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [name, setName] = useState(initialData?.name || "")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formRef.current) {
      const formData = new FormData(formRef.current)
      await onSubmit(formData)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 mx-auto">
      {initialData && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">ID</Label>
                <div className="font-medium">{initialData.id}</div>
              </div>
              {initialData.original_map_id && (
                <div>
                  <Label className="text-muted-foreground">Original Map ID</Label>
                  <div className="font-medium">{initialData.original_map_id}</div>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Created At</Label>
                <div className="font-medium">{formatDate(initialData.created_at)}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Updated At</Label>
                <div className="font-medium">{formatDate(initialData.updated_at)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base">
            Map Name
          </Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter map name"
            required
            className="mt-1"
          />
        </div>

        <FileUploadField
          id="thumbnailFile"
          name="thumbnailFile"
          label="Map Thumbnail"
          accept=".png,.jpg,.jpeg,.webp,.tiff,.gif,.svg,.avif,.heif,.raw"
          required={!initialData}
          helpText="Upload an image to use as the map thumbnail"
        />

        <FileUploadField
          id="mapFile"
          name="mapFile"
          label="Tiled Map (.tmx)"
          accept=".tmx"
          required={!initialData}
          helpText="Upload the Tiled Map file"
        />

        <FileUploadField
          id="jsonFile"
          name="jsonFile"
          label="Map JSON Source (.json)"
          accept=".json"
          required={!initialData}
          helpText="Upload the JSON source file"
        />

        <FileUploadField
          id="tilesetFiles"
          name="tilesetFiles"
          label="Tilesets (.tsx)"
          accept=".tsx"
          multiple
          helpText="Upload tileset files"
        />

        <FileUploadField
          id="templateFiles"
          name="templateFiles"
          label="Templates (.tx)"
          accept=".tx"
          multiple
          helpText="Upload template files"
        />

        <div className="md:col-span-2">
          <FileUploadField
            id="imageFiles"
            name="imageFiles"
            label="Images Used (.png, .jpg, .jpeg)"
            accept=".png,.jpg,.jpeg"
            multiple
            helpText="Upload image files (multiple files allowed)"
          />
        </div>
      </div>

      <div className="flex justify-end max-w-2xl">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : submitButtonText}
        </Button>
      </div>
    </form>
  )
}

