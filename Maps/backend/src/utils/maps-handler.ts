import { FileArray, UploadedFile } from "express-fileupload"
import { CustomError } from "./custom-error"
import { toLower } from "lodash"

export enum FileTypes {
    MapFile = "mapFile",
    JsonFile = "jsonFile",
    TilesetFiles = "tilesetFiles",
    TemplateFiles = "templateFiles",
    ImageFiles = "imageFiles"
}

export const fileTypes = Object.values(FileTypes)
export const thumbnailFileType = "thumbnailFile"
const boothesClassName = "Booths"

export const handleMapFiles = (files: FileArray): void => {
    try {
        if (!files[FileTypes.MapFile] || !files[FileTypes.JsonFile]) {
            const missingFiles = fileTypes.slice(0, 2)
                .filter(type => !files[type])
                .map(type => `Please upload the ${type}`)
            
            if (missingFiles.length > 0) {
                throw new CustomError(missingFiles, 400)
            }
        }

        const jsonFile = files[FileTypes.JsonFile] as UploadedFile
        
        
        const filesRequired = getRequiredFilesFromJSONFile(jsonFile.data)

        const tilsetFilesUploaded = Array.isArray(files[FileTypes.TilesetFiles]) 
            ? files[FileTypes.TilesetFiles] as UploadedFile[] 
            : [files[FileTypes.TilesetFiles] as UploadedFile]
        const tilsetFilesReceived = tilsetFilesUploaded.map((template) => template.name)

        const templateFilesUploaded = Array.isArray(files[FileTypes.TemplateFiles]) 
            ? files[FileTypes.TemplateFiles] as UploadedFile[] 
            : [files[FileTypes.TemplateFiles] as UploadedFile]
        const templateFilesReceived = templateFilesUploaded.map((template) => template.name)

        const missingFiles: string [] = []
        
        filesRequired.tilesets.forEach((tileset) => {
            if (tilsetFilesReceived.indexOf(tileset) === -1) {
                missingFiles.push(`${tileset} file is missing`)
            }
        })

        filesRequired.templates.forEach((template) => {
            if (templateFilesReceived.indexOf(template) === -1) {
                missingFiles.push(`${template} file is missing`)
            }
        })

        console.log("uploaded templates:", templateFilesReceived);
        console.log("uploaded tilesets:", tilsetFilesReceived);
        

        if (missingFiles.length !== 0) {
            throw new CustomError(missingFiles, 400)
        }
    } catch (err: any) {
        throw err
    }
}

const getRequiredFilesFromJSONFile = (data : Buffer) : { tilesets: Set<string>, templates: Set<string> } => {
    try {
        const jsonData = JSON.parse(data.toString())
        console.log("JSON:", jsonData)
        const templatesRequired: Set<string> = new Set()
        const tilesetsRequired: Set<string> = new Set(jsonData.tilesets.map((tileset: any) => tileset.source))

        for (const layer of jsonData.layers) {
            if (layer?.class && toLower(layer.class) === toLower(boothesClassName)) {
                if (layer.layers) {
                    for (const subLayer of layer.layers) {
                        if (subLayer.objects) {
                            for (const obj of subLayer.objects) {
                                if (obj.template) {
                                    templatesRequired.add(obj.template)
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log("templatesRequired:", templatesRequired)
        console.log("tilesetsRequired:", tilesetsRequired)

        return {
            templates: templatesRequired,
            tilesets: tilesetsRequired
        }
        
    } catch (err: any) {
        throw err
    }
}