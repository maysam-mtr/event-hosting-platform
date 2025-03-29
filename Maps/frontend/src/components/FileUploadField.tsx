import type React from "react"

import { useState, useRef } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Upload, X, FileText } from "lucide-react"

interface FileUploadFieldProps {
  id: string
  name: string
  label: string
  accept: string
  multiple?: boolean
  required?: boolean
  helpText?: string
}

export default function FileUploadField({
  id,
  name,
  label,
  accept,
  multiple = false,
  required = false,
  helpText,
}: FileUploadFieldProps) {
  const [files, setFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files)
      setFiles(multiple ? fileList : [fileList[0]])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))

    // Reset the input value to allow re-uploading the same file
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-base">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="flex items-center">
        <Input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          required={required && files.length === 0}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button type="button" variant="outline" onClick={handleButtonClick} className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          {multiple ? "Upload Files" : "Upload File"}
        </Button>
      </div>

      {helpText && <p className="text-sm text-muted-foreground">{helpText}</p>}

      {files.length > 0 && (
        <div className="mt-2 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                <span className="text-xs text-muted-foreground ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFile(index)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

