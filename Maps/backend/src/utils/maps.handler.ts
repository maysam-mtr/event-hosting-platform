import { FileArray, UploadedFile } from "express-fileupload"
import { CustomError } from "./Response & Error Handling/custom-error"
import { toLower } from "lodash"
import { ensureArray, sanitizePath } from "./Helpers/helper-functions"

export enum FileTypes {
    MapFile = "mapFile",
    JsonFile = "jsonFile",
    TilesetFiles = "tilesetFiles",
    TemplateFiles = "templateFiles",
    ImageFiles = "imageFiles"
}

export const fileTypes = Object.values(FileTypes)
export const thumbnailFileType = "thumbnailFile"
export const boothesClassName = "Booths"
export const collisionsClassName = "Collisions"

export const getRequiredFilesFromJSONFile = (data : Buffer) : { tilesets: Set<string>, templates: Set<string> } => {
    try {
        const jsonData = JSON.parse(data.toString())

        const templatesRequired: Set<string> = new Set()
        const tilesetsRequired: Set<string> = new Set(jsonData.tilesets.map((tileset: any) => sanitizePath(tileset.source)))

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

        return {
            templates: templatesRequired,
            tilesets: tilesetsRequired
        }
        
    } catch (err: any) {
        throw new CustomError("Error gathering required map files", 400)
    }
}